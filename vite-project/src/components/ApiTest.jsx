import { useEffect, useState } from "react";

const ApiTest = () => {
  const [users, setUsers] = useState([]); // بدل المصفوفة الثابتة
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟡 جلب المستخدمين
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error loading users:", err.message));
  }, []);

  // 🟡 جلب البوستات عند تغيير المستخدم المحدد
  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      setError("");

      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUser}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load posts");
          return res.json();
        })
        .then((data) => setPosts(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [selectedUser]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-1/4 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user.id)}
            className={`p-4 mb-2 rounded-lg cursor-pointer transition ${
              selectedUser === user.id
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-100"
            }`}
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <h3 className="text-lg font-semibold">
              <span className="text-sm font-semibold text-red-500">
                USER NAME:&nbsp;
              </span>
              {user.username}
            </h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400">User ID: {user.id}</p>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-6 overflow-y-auto min-w-0">
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {!loading && posts.length === 0 && selectedUser && (
          <p>No posts found for this user.</p>
        )}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {post.title}
              </h4>
              <hr className="text-gray-300" />
              <p className="text-gray-700 text-base">{post.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ApiTest;
