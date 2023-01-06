// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='content'>
    <div class='game01'></div>
    <div class='game02'></div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>`;

// ⚡️ Create class
class Game01 {
  constructor(root) {
    this.render(root);

    this.DOM = {
      cards: document.querySelectorAll(`.${root} li`),
    };

    this.PROPS = {
      matched: 0,
      cardOne: '',
      cardTwo: '',
      disableDeck: false,
    };

    this.shuffle();
    this.DOM.cards.forEach(card => card.addEventListener('click', this.flip));

  }

  /**
   * @function render - Render starter HTML
   * @param root
   */
  render = (root) => {
    document.querySelector(`.${root}`).innerHTML = `
      <div class='memory-game'>
        <h3 class='title h4'>Memory Card Game</h3>
        <ul>
          ${Array.from({ length: 8 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='./assets/images/picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='./assets/images/img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}

          ${Array.from({ length: 8 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='./assets/images/picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='./assets/images/img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}
        </ul>
      </div>
    `;
  };

  /**
   * @function shuffle - Shuffle cards
   */
  shuffle = () => {
    // Set default values
    this.PROPS.matched = 0;
    this.PROPS.disableDeck = false;
    this.PROPS.cardOne = this.PROPS.cardTwo = '';
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() > 0.5 ? 1 : -1);
    // Update card image
    this.DOM.cards.forEach((card, i) => {
      card.classList.remove('flip');
      card.querySelector('.back img').src = `./assets/images/img-${array[i]}.png`;
      card.addEventListener('click', this.flip);
    });
  };

  /**
   * @function flip - Flip card
   * @param clickedCard
   * @returns {*}
   */
  flip = ({ target: clickedCard }) => {
    if (this.PROPS.cardOne !== clickedCard && !this.PROPS.disableDeck) {
      clickedCard.classList.add('flip');
      if (!this.PROPS.cardOne) {
        return this.PROPS.cardOne = clickedCard;
      }
      this.PROPS.cardTwo = clickedCard;
      this.PROPS.disableDeck = true;
      // Check is cards matched
      this.matchCards(this.PROPS.cardOne.querySelector('.back img').src, this.PROPS.cardTwo.querySelector('.back img').src);
    }
  };

  /**
   * @function matchCards - Check matched cards
   * @param img1
   * @param img2
   * @returns {boolean}
   */
  matchCards = (img1, img2) => {
    if (img1 === img2) {
      // Update counter
      this.PROPS.matched++;
      // End Game
      if (this.PROPS.matched === 8) {
        setTimeout(() => {
          return this.shuffle();
        }, 1000);
      }
      // Set default values
      this.PROPS.cardOne.removeEventListener('click', this.flip);
      this.PROPS.cardTwo.removeEventListener('click', this.flip);
      this.PROPS.cardOne = this.PROPS.cardTwo = '';
      return this.PROPS.disableDeck = false;
    }
    // Add shake animation
    setTimeout(() => {
      this.PROPS.cardOne.classList.add('shake');
      this.PROPS.cardTwo.classList.add('shake');
    }, 400);
    // Set default values
    setTimeout(() => {
      this.PROPS.cardOne.classList.remove('shake', 'flip');
      this.PROPS.cardTwo.classList.remove('shake', 'flip');
      this.PROPS.cardOne = this.PROPS.cardTwo = '';
      this.PROPS.disableDeck = false;
    }, 1200);
  };
}
class Game02 {
  constructor(root) {
    this.render(root);

    this.DOM = {
      cards: document.querySelectorAll(`.${root} li`),
      timeEl: document.querySelector('[data-time]'),
      flipEl: document.querySelector('[data-flip]'),
      refreshBtn: document.querySelector('[data-refresh]'),
    };

    this.PROPS = {
      maxTime: 20,
      timeLeft: 20,
      flips: 0,
      matchedCard: 0,
      disableDeck: false,
      isPlaying: false,
      cardOne: '',
      cardTwo: '',
      timer: null,
    };

    this.shuffle();
    this.DOM.refreshBtn.addEventListener('click', this.shuffle);
    this.DOM.cards.forEach(c => c.addEventListener('click', this.flip));
  }

  /**
   * @function render - Render starter HTML
   * @param root
   */
  render = (root) => {
    document.querySelector(`.${root}`).innerHTML = `
      <div class='memory-game'>
        <h3 class='title h4'>Memory Card Game</h3>
        <ul>
          ${Array.from({ length: 6 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='./assets/images/picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='./assets/images/img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}

          ${Array.from({ length: 6 }).map((_, idx) => `
          <li>
            <div class='view front'>
              <img src='./assets/images/picture.png' alt='icon'>
            </div>
            <div class='view back'>
              <img src='./assets/images/img-${idx + 1}.png' alt='card-img'>
            </div>
          </li>
          `).join('')}
        </ul>

        <div class='details'>
          <p class='time'>Time: <span data-time=''>0s</span></p>
          <p class='flips'>Flips: <span data-flip=''>3</span></p>
          <button data-refresh=''>Refresh</button>
        </div>
      </div>
    `;
  };

  /**
   * @function shuffle - Shuffle cards
   */
  shuffle = () => {
    // Set default values
    this.PROPS.timeLeft = this.PROPS.maxTime;
    this.PROPS.flips = this.PROPS.matchedCard = 0;
    this.PROPS.cardOne = this.PROPS.cardTwo = '';

    // Clear timer
    clearInterval(this.PROPS.timer);

    // Set values
    this.DOM.timeEl.innerText = this.PROPS.timeLeft;
    this.DOM.flipEl.innerText = this.PROPS.flips;
    this.PROPS.disableDeck = this.PROPS.isPlaying = false;

    // Create random sorted array
    const array = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].sort(() => Math.random() > 0.5 ? 1 : -1);

    // Remove flip class name and shuffle card position
    this.DOM.cards.forEach((card, i) => {
      card.classList.remove('flip');
      setTimeout(() => {
        card.querySelector('.back img').src = `/assets/images/img-${array[i]}.png`;
      }, 500);
      card.addEventListener('click', this.flip);
    });
  };

  /**
   * @function flip - Flip card
   * @param target
   */
  flip = ({ target: clickedCard }) => {
    // Check condition
    if (!this.PROPS.isPlaying) {
      this.PROPS.isPlaying = true;
      this.PROPS.timer = setInterval(this.initTimer, 1000);
    }

    // Count flips and add class to clicked card
    if (clickedCard !== this.PROPS.cardOne && !this.PROPS.disableDeck && this.PROPS.timeLeft > 0) {
      this.PROPS.flips++;
      this.DOM.flipEl.innerText = this.PROPS.flips;
      clickedCard.classList.add('flip');
      if (!this.PROPS.cardOne) {
        return this.PROPS.cardOne = clickedCard;
      }
      this.PROPS.cardTwo = clickedCard;
      this.PROPS.disableDeck = true;

      // Check if cards is matched
      this.match(this.PROPS.cardOne.querySelector('.back img').src, this.PROPS.cardTwo.querySelector('.back img').src);
    }
  };

  /**
   * @function match - Check if cards is matched
   * @param img1
   * @param img2
   * @returns {boolean|void}
   */
  match = (img1, img2) => {
    if (img1 === img2) {
      // Update counter
      this.PROPS.matchedCard++;

      // Finish Game
      if (this.PROPS.matchedCard === 6 && this.PROPS.timeLeft > 0) {
        return clearInterval(this.PROPS.timer);
      }
      // Set default values
      this.PROPS.cardOne.removeEventListener('click', this.flip);
      this.PROPS.cardTwo.removeEventListener('click', this.flip);
      this.PROPS.cardOne = this.PROPS.cardTwo = '';
      return this.PROPS.disableDeck = false;
    }

    // Add shake effect
    setTimeout(() => {
      this.PROPS.cardOne.classList.add('shake');
      this.PROPS.cardTwo.classList.add('shake');
    }, 400);

    // Remove shake effect and set values
    setTimeout(() => {
      this.PROPS.cardOne.classList.remove('shake', 'flip');
      this.PROPS.cardTwo.classList.remove('shake', 'flip');
      this.PROPS.cardOne = this.PROPS.cardTwo = '';
      this.PROPS.disableDeck = false;
    }, 1200);
  };

  /**
   * @function initTimer - Timer
   */
  initTimer = () => {
    if (this.PROPS.timeLeft <= 0) {
      return clearInterval(this.PROPS.timer);
    }
    this.PROPS.timeLeft--;
    this.DOM.timeEl.innerText = this.PROPS.timeLeft;
  };
}

// ⚡️ Class instance
new Game01('game01');
new Game02('game02');


