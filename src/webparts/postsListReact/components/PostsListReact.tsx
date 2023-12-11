import * as React from "react";
import styles from "./PostsListReact.module.scss";
import { IPostsListReactProps } from "./IPostsListReactProps";
import { escape } from "@microsoft/sp-lodash-subset";
import axios from "axios";

import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IPostsListState {
  posts?: IPost[];
  selectedPostId?: number;
  postDetails?: IPost; // Adjust the type based on your post details structure
}

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export default class PostsListReact extends React.Component<
  IPostsListReactProps,
  IPostsListState
> {
  /**
   *
   */
  constructor(props: IPostsListReactProps) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    // Fetch data from the API when the component mounts
    this._fetchData();
  }
  private _fetchData() {
    const apiUrl = "https://jsonplaceholder.typicode.com/posts";

    axios
      .get(apiUrl)
      .then((response) => {
        const data: IPost[] = response.data;
        console.log(data);

        this.setState({ posts: data });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  public render(): React.ReactElement<IPostsListReactProps> {
    return (
      <div className={styles.postsListReact}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="posts">{this._showTableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          className={
            this.state.selectedPostId !== -1 ? "showDetails" : "hideDetails"
          }
        >
          {/* Post details popup */}
          {this.state.postDetails && (
            <div className="popup">
              <div className="popup-content">
                <h2>Post Details</h2>
                <p>Title: {this.state.postDetails.title}</p>
                <p>Body: {this.state.postDetails.body}</p>
                <button onClick={() => this.closePostDetails()}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  private _showTableRows() {
    return this.state.posts.map((post) => {
      return (
        <tr key={post.id}>
          <td>{post.title}</td>
          <td>{post.body}</td>
          <td>
            <button onClick={() => this.openPostDetails(post.id)}>
              View Post
            </button>
          </td>
        </tr>
      );
    });
  }

  private openPost(postId: number) {
    // Dispatch a custom event with the selected post ID
    const event = new CustomEvent("postSelected", {
      detail: { postId },
    });
    window.dispatchEvent(event);
  }

  private openPostDetails(postId: number): void {
    // Fetch post details using the postId
    // Adjust the URL and API endpoint based on your actual scenario
    const apiUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const selectedPost: IPost = response.data;
        this.setState({
          selectedPostId: selectedPost.id,
          postDetails: selectedPost,
        });
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }

  private closePostDetails(): void {
    // Clear the selected post details
    this.setState({
      selectedPostId: -1,
      postDetails: null,
    });
  }
}
