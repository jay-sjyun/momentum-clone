const quotes = [
  { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { quote: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { quote: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { quote: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { quote: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { quote: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
  { quote: "It is never too late to be what you might have been.", author: "George Eliot" },
  { quote: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw" },
  { quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { quote: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings" },
];

const $quote = document.querySelector(".js-quote q:first-child");
const $author = document.querySelector(".js-quote span:last-child");

const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

$quote.textContent = `"${todaysQuote.quote}"`;
$author.textContent = todaysQuote.author;
