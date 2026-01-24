const Feed = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feed</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Post Title {item}</h3>
            <p className="text-gray-600">
              This is a sample post content. It represents an update or shared resource in the feed.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
