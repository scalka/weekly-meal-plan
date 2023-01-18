const Tag = ({ children, colorClass = 'bg-rp-pink-50' }) => {
  return (
    <div
      className={`inline-block rounded-md px-1 py-1 text-xs text-rp-green-80 mr-1 mb-1 ${colorClass}`}
    >
      {children}
    </div>
  );
};

export default Tag;
