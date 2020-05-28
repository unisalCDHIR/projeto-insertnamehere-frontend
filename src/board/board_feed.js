import React from "react"

export default function DatatoFeed(boardCards){
      
      let itemsFromBackendBacklog = [];
      let itemsFromBackendToDo = [];
      let itemsFromBackendOnGoing = [];
      let itemsFromBackendDone = [];
    
      let lock = false;
    
      async function feedBoard() {
        if(boardCards.length > 0){
          boardCards.forEach(element => {
            if (element.column === "BACKLOG") {
              itemsFromBackendBacklog.push({ id: element.id, content: element.description, name: element.name, column: element.column, users: element.users })
            }
            else if (element.column === "TODO") {
              itemsFromBackendToDo.push({ id: element.id, content: element.description, name: element.name, column: element.column, users: element.users })
            }
            else if (element.column === "ONGOING") {
              itemsFromBackendOnGoing.push({ id: element.id, content: element.description, name: element.name, column: element.column, users: element.users })
            }
            else if (element.column === "DONE") {
              itemsFromBackendDone.push({ id: element.id, content: element.description, name: element.name, column: element.column, users: element.users })
            }
          });

          itemsFromBackendBacklog.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendToDo.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendOnGoing.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendDone.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
        }
        else{
          itemsFromBackendBacklog.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendToDo.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendOnGoing.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
          itemsFromBackendDone.push({id: "temp", content: "Solte seu card aqui", name: "    ", users: [{ avatar: "" }]});
        }
           
        }
    
        
        if(!lock){
            feedBoard();
            lock = true;
        }
        
        const columnsFromBackend = [
          {
            name: "BACKLOG",
            items: itemsFromBackendBacklog
          },
           {
            name: "TO DO",
            items: itemsFromBackendToDo
          },
           {
            name: "ON GOING",
            items: itemsFromBackendOnGoing
          },
           {
            name: "DONE",
            items: itemsFromBackendDone
          }
        ];
    

        return columnsFromBackend;
    
    }
