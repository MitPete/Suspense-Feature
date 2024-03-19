# React Suspense Demo

This project demonstrates how to use React Suspense to handle data fetching. It simulates fetching posts and comments data with artificial delay and displays them in a user-friendly way.

## Project Structure

The main component is `App`, which maintains the state for the current post ID and resources for fetching the post and its comments. It uses React Suspense and an Error Boundary to handle loading and error states.

The `Post` and `Comments` components are responsible for displaying the post and comments data. They read from the resources passed in props, which may throw a promise (if the data is still loading) or an error.

The `fetchPost` and `fetchComments` functions simulate fetching data from an API. They return promises that resolve after a delay.

The `createResource` function creates a resource object with a `read` method. This method throws the promise if the data is still loading, throws the error if the fetch failed, or returns the data if it's available.

