import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
  PropertyPaneToggle,
} from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./HelloWorldWebPart.module.scss";
import * as strings from "HelloWorldWebPartStrings";

// required to use helper classes to call the endpoints
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
export interface IHelloWorldWebPartProps {
  description: string;
  // continent: string;
  // NoOfVistiedContinent: number;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  public render(): void {
    this.context.statusRenderer.displayLoadingIndicator(
      this.domElement,
      "the loader"
    );
    setTimeout(() => {
      this.context.statusRenderer.clearLoadingIndicator(this.domElement);
      this.domElement.innerHTML = `      
        <div class="${styles.helloWorld}">
          <div class="${styles.container}">
            <div class="${styles.row}">
            <div class="${styles.column}">
             description: ${escape(this.properties.description)}
             </div>
         
            
           
            
            </div>
          </div>
        </div>
        `;
    }, 2000);

    // <div class="${styles.column}">
    //  continent: ${escape(this.properties.continent)}
    // </div>
    // <div class="${styles.column}">
    //  Number of visited continent: ${this.properties.NoOfVistiedContinent}
    // </div>
    this._getListData();
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient
      .get(
        `https://jsonplaceholder.typicode.com/users`,
        SPHttpClient.configurations.v1
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json();
        }
      })
      .catch((err) => {
        throw new Error("error happened");
      });
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

                // PropertyPaneTextField("continent", {
                //   label: strings.DescriptionFieldLabel,
                //   onGetErrorMessage: this.validContinent.bind(this),
                // }),
                // PropertyPaneSlider("NoOfVistiedContinent", {
                //   min: 0,
                //   max: 7,
                //   step: 1,
                //   value: 0,
                // }),
              ],
            },
          ],
        },
      ],
    };
  }
  validContinent(textBoxValue: string) {
    const continents = [
      "africa",
      "australia",
      "asia",
      "north america",
      "south america",
      "antractica",
    ];

    return continents.indexOf(textBoxValue.toLowerCase()) === -1
      ? "Please write a valid continent!"
      : "";
  }
}
