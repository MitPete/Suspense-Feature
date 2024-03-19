import React, { Suspense, useState, useEffect, useRef, Component } from 'react';
import './App.css';

// Define a function that fetches some data
const fetchPost = id =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (id > 5) {
        reject(new Error('Invalid post ID'));
      } else {
        resolve({ id, title: `Post ${id}`, content: `This is the content of post ${id}` });
      }
    }, 2000 * id)
  );

// Define a function that fetches comments for a post
const fetchComments = postId =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(Array.from({ length: 5 }, (_, i) => ({ id: i, content: `Comment ${i} on post ${postId}` })));
    }, 2000 * postId)
  );

// Create a resource with a read() method that throws the promise if data is not yet available
const createResource = promise => {
  let status = 'loading';
  let result;
  let error;
  return {
    read() {
      if (status === 'loading') {
        throw promise.then(
          r => {
            status = 'success';
            result = r;
          },
          e => {
            status = 'error';
            error = e;
          }
        );
      } else if (status === 'success') {
        return result;
      } else if (status === 'error') {
        throw error;
      }
    },
  };
};

// Define a component that displays a single post
const Post = ({ resource }) => {
  const post = resource.read();

  return (
    <div>
      <h2 className="postTitle">{post.title}</h2>
      <p className="postContent">{post.content}</p>
    </div>
  );
};

// Define a component that displays comments for a post
const Comments = ({ resource }) => {
  const comments = resource.read();

  return (
    <div>
      <h2>Comments</h2>
      {comments.map(comment => (
        <p key={comment.id}>{comment.content}</p>
      ))}
    </div>
  );
};

// Define an error boundary
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }

    return this.props.children;
  }
}

// Wrap our component with Suspense and ErrorBoundary to handle data fetching
const App = () => {
  const [id, setId] = useState(1);
  const [postResource, setPostResource] = useState(createResource(fetchPost(id)));
  const [commentsResource, setCommentsResource] = useState(createResource(fetchComments(id)));
  const prevId = useRef(id);

  useEffect(() => {
    if (prevId.current !== id) {
      setPostResource(createResource(fetchPost(id)));
      setCommentsResource(createResource(fetchComments(id)));
      prevId.current = id;
    }
  }, [id]);

  return (
    <div className="container">
      <h1 className="title">Posts</h1>
      <div>
        {Array.from({ length: 6 }, (_, i) => i + 1).map(postId => (
          <button className="button" key={postId} onClick={() => setId(postId)}>
            View Post {postId}
          </button>
        ))}
      </div>
      <ErrorBoundary>
        <Suspense fallback={<div className="loader">Loading post...</div>}>
          <Post resource={postResource} />
        </Suspense>
        <Suspense fallback={<div className="loader">Loading comments...</div>}>
          <Comments resource={commentsResource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;