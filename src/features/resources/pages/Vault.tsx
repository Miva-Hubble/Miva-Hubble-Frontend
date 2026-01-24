const Vault = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resources Vault</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['React', 'TypeScript', 'Tailwind', 'Node.js'].map((tech) => (
          <div key={tech} className="bg-white p-6 rounded-lg shadow text-center cursor-pointer hover:shadow-md transition">
            <div className="h-12 w-12 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 font-bold">
              {tech[0]}
            </div>
            <h3 className="font-medium">{tech}</h3>
            <p className="text-sm text-gray-500 mt-2">View resources</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vault;
