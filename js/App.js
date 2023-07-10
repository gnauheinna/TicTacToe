// Actions a user can take in my app
//  1. new round
// 2. game move
// 3. reset current game
// 4. toggle meni
const App = {
      // all of our selected HTML elements
      $: {
            menu: document.querySelector('[data-id="menu"]'),
            menuItems: document.querySelector('[data-id="menu-items"]'),
            resetBtn: document.querySelector('[data-id="reset-btn"]'),
            newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
            squares: document.querySelectorAll('[data-id="square"]'),
      },

      // where we add our event listeners to the application
      init() {
          App.registerEventListeners();  
      },
      registerEventListeners(){
            //menu toggling
            App.$.menu.addEventListener('click', (event) => {
                  App.$.menuItems.classList.toggle("hidden");
            });

            //select reset button
            App.$.resetBtn.addEventListener('click', (event)=>{
                  console.log("reset the game");
            });

            //select new round
            App.$.newRoundBtn.addEventListener('click', (event)=>{
                  console.log("new round");
            });

            //select squares
            App.$.squares.forEach(square =>{                //iterates through the list of nodes
                  square.addEventListener('click', (event) =>{
                        console.log(`square ${event.target.id} was clicked`);
                  });
            });
      }
};

// whenever the website loads it initializes
window.addEventListener('load', App.init);



