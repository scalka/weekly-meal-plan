type ButtonProps = {
  variation?: 'primary' | 'secondary';
  children: String;
  size?: 'small' | 'medium' | 'large';
  customStyle?: String;
  onClick: () => void;
  [x: string]: any;
};

const Button = ({
  variation = 'primary',
  children,
  size = 'medium',
  customStyle = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`btn-${variation} ${customStyle}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
