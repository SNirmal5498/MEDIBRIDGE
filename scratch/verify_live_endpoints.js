import http from "http";

function postJson(urlPath, body) {
  return new Promise((resolve, reject) => {
    const dataStr = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: urlPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(dataStr),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve({ raw });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(dataStr);
    req.end();
  });
}

function getJson(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "localhost",
        port: 5000,
        path: urlPath,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve({ raw });
          }
        });
      }
    );
    req.on("error", reject);
  });
}

async function verifyLiveBackend() {
  console.log("==================================================");
  console.log("      VERIFYING LIVE BACKEND & TRANSLATIONS      ");
  console.log("==================================================");

  try {
    const stats = await getJson("/api/translation/stats");
    console.log("Translation Stats:", stats);

    const testObject = {
      id: "clavam-625",
      brand: "Clavam 625",
      genericName: "Amoxicillin and Potassium Clavulanate Tablets IP",
      category: "Antibiotics",
      manufacturer: "Alkem Laboratories Ltd",
      dosageForm: "Tablet",
      strength: "500mg+125mg",
      packSize: "Strip of 10 tablets",
      description: "Clavam 625 is an antibiotic medicine used to treat bacterial infections.",
    };

    const fields = [
      "brand",
      "genericName",
      "category",
      "manufacturer",
      "dosageForm",
      "strength",
      "packSize",
      "description",
    ];

    const langs = ["ta", "hi", "te", "ml", "kn"];

    for (const lang of langs) {
      console.log(`\n--- Testing Live Backend Object Translation for '${lang.toUpperCase()}' ---`);
      const res = await postJson("/api/translation/object", {
        object: testObject,
        fields,
        targetLang: lang,
      });

      console.log(`Success: ${res.success}`);
      if (res.translatedObject) {
        console.log(` Brand: '${res.translatedObject.brand}'`);
        console.log(` Generic: '${res.translatedObject.genericName}'`);
        console.log(` Category: '${res.translatedObject.category}'`);
        console.log(` Manufacturer: '${res.translatedObject.manufacturer}'`);
        console.log(` Strength: '${res.translatedObject.strength}'`);
      }
    }
  } catch (err) {
    console.error("Live Verification Error:", err.message);
  }

  console.log("==================================================");
}

verifyLiveBackend();
