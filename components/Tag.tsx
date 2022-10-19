const Tag = ({ children, colorClass = 'bg-pink' }) => {
  return (
    <div
      className={`inline-block rounded-md px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1 ${colorClass}`}
    >
      {children}
    </div>
  );
};

export default Tag;
