const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-white text-text border border-border hover:border-primary/40 hover:text-primary-hover",
  ghost: "bg-transparent text-text hover:bg-primary-50",
  danger: "bg-danger-50 text-danger hover:bg-danger/10",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </Component>
  );
}