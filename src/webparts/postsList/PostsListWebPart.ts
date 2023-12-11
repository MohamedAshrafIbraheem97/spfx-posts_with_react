import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";
import { IconButton } from "office-ui-fabric-react/lib";

import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import styles from "./PostsListWebPart.module.scss";
import * as strings from "PostsListWebPartStrings";

export interface IPostsListWebPartProps {
  description: string;
}

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default class PostsListWebPart extends BaseClientSideWebPart<IPostsListWebPartProps> {
  posts: IPost[] = [];
  private _getPosts() {
    // this.context.statusRenderer.displayLoadingIndicator(
    //   this.domElement,
    //   "Loading posts"
    // );
    this.context.spHttpClient
      .get(
        "https://jsonplaceholder.typicode.com/posts",
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => res.json())
      .then((data: IPost[]) => {
        // this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.posts = data;
        this._showTableRows();
      });
  }
  public render(): void {
    this._getPosts();

    this.domElement.innerHTML = `
      <div class="${styles.postsList}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Body</th>                    
                    <th>Action</th>                    
                  </tr>
                </thead>
                <tbody class="posts">
                </tbody>                
              </table>                
            </div>
          </div>
        </div>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }
  private _showTableRows() {
    console.log(document.querySelector(".posts"));

    // document.querySelector(".posts").innerHTML += this.posts.map((post) => {
    //   return ` <tr id=${post.id}>
    //     <td>${post.title}</td>
    //     <td>${post.body}</td>
    //     <td>
    //     <button onClick={${() => {
    //       this.openPost(post.id);
    //     }}}> view Post</button>
    //     </td>

    //     </tr> `;
    // });
    document.querySelector(".posts").innerHTML += this.posts.map((post) => {
      return `
        <tr id=${post.id}>
          <td>${post.title}</td>
          <td>${post.body}</td>
          <td>
            <button onClick={() => this.openPost(post.id)}>View Post</button>
          </td>
        </tr>
      `;
    });
  }
  openPost(postId: number) {
    // alert(postId);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
