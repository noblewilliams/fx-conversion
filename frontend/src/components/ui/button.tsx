import { LoadingSpinner } from "./loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export const Button = ({ children, loading, ...props }: ButtonProps) => {
  return (
    <button
      className="w-full flex items-center justify-center py-3 px-4 rounded-2xl shadow-sm text-sm font-medium text-white hover:opacity-70 bg-black disabled:cursor-not-allowed transition-all disabled:opacity-50 duration-700 ease-in-out cursor-pointer"
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};
