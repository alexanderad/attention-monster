/*
* Selected quotes from https://en.wikiquote.org/wiki/Future
*/
const quotes = [
  [
    "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
    "Marcus Aurelius Antoninus, Meditations"
  ],
  [
    "People ask me to predict the future, when all I want to do is prevent it. Better yet, build it. Predicting the future is much too easy, anyway. You look at the people around you, the street you stand on, the visible air you breathe, and predict more of the same. To hell with more. I want better.",
    "Ray Bradbury, Beyond 1984: The People Machines (1979)"
  ],
  [
    "<i>The Terminator</i>: It must end here... or I am the future.",
    "James Cameron, William Wisher"
  ],
  [
    "The future will soon be a thing of the past.",
    "George Carlin, Napalm and Silly Putty"
  ],
  [
    "The empires of the future are the empires of the mind.",
    "Winston Churchill, speech at Harvard University, September 6, 1943"
  ],
  [
    "Of this I am quite sure, that if we open a quarrel between the past and the present, we shall find that we have lost the future.",
    "Winston Churchill, Speech in the House of Commons, June 18, 1940"
  ],
  [
    "Take hold of the future or the future will take hold of you -- be futurewise.",
    "Patrick Dixon, Futurewise 1998/2005"
  ],
  [
    "The only thing we know about the future is that it is going to be different.",
    "Peter Drucker, Management: Tasks, Responsibilities, Practices (1973)"
  ],
  [
    "I never think of the future. It comes soon enough.",
    "Albert Einstein, Attributed in The Encarta Book of Quotations"
  ],
  [
    "Your task is not to foresee the future, but to enable it.",
    "Antoine de Saint Exupéry, Citadelle or The Wisdom of the Sands (1948)"
  ],
  [
    "The future cannot be predicted, but futures can be invented .",
    "Dennis Gabor, Inventing the Future (1963)"
  ],
  [
    "The best way to predict the future is to invent it.",
    "Alan Kay (1971) at a 1971 meeting of PARC"
  ],
  [
    "I do not want to foresee the future. I am concerned with taking care of the present. God has given me no control over the moment following.",
    "Mahatma Gandhi, in Anthony Parel Gandhi"
  ],
  [
    "Marty, the future isn't written. It can be changed. You know that. Anyone can make their future whatever they want it to be.",
    "Doc Emmett Brown, Back to the Future Part III (1990)"
  ],
  [
    "The future is already here — it's just not very evenly distributed.",
    "William Gibson"
  ],
  [
    "Even if some different theory is discovered in the future, I don’t think time travel will ever be possible. If it were, we would have been overrun by tourists from the future by now.",
    "Stephen Hawking"
  ],
  [
    "I like the dreams of the future better than the history of the past, — so good night!",
    "Thomas Jefferson, Letter to John Adams (1 August 1816)"
  ],
  [
    "The future is not laid out on a track. It is something that we can decide, and to the extent that we do not violate any known laws of the universe, we can probably make it work the way that we want to.",
    "Alan Kay in 1984 in his paper Inventing the Future"
  ],
  [
    "We are not here to curse the darkness, but to light the candle that can guide us through that darkness to a safe and sane future.",
    "John F. Kennedy, Presidential Nomination Acceptance Speech"
  ],
  [
    "The past and future are veiled; but the past wears the widow's veil; the future, the virgin's.",
    "Jean Paul, as quoted in Treasury of Thought (1872) by Maturin M. Ballou, p. 521"
  ],
  [
    "We have no right to assume that any physical laws exist, or if they have existed up until now, that they will continue to exist in a similar manner in the future.",
    "Max Planck, The Universe in the Light of Modern Physics (1931)"
  ],
  [
    "We must discipline ourselves to convert dreams into plans, and plans into goals, and goals into those small daily activities that will lead us, one sure step at a time, toward a better future.",
    "Jim Rohn, Five Major Pieces To the Life Puzzle (1991)"
  ],
  [
    "The future belongs to those who believe in the beauty of their dreams.",
    "Eleanor Roosevelt"
  ],
  [
    "We can chart our future clearly and wisely only when we know the path which has led to the present.",
    "Adlai Stevenson, Speech, Richmond, Virginia (20 September 1952)"
  ],
  [
    "Let the future tell the truth and evaluate each one according to his work and accomplishments. The present is theirs; the future, for which I really worked, is mine.",
    "Nikola Tesla, On patent controversies regarding the invention of Radio and other things"
  ],
  [
    "The problem with the future is that it keeps turning into the present.",
    "Bill Watterson, Calvin and Hobbes (1985)"
  ],
  [
    "My visions of the future are always pretty much standard issue. The rich get richer, the poor get poorer... and there are flying cars.",
    "Joss Whedon, Foreword to Fray"
  ],
  [
    "You'll see that, since our fate is ruled by chance,<br />Each man, unknowing, great,<br />Should frame life so that at some future hour<br />Fact and his dreamings meet.",
    "Victor Hugo, To His Orphan Grandchildren"
  ],
  [
    "The future is a world limited by ourselves; in it we discover only what concerns us and, sometimes, by chance, what interests those whom we love the most.",
    "Maurice Maeterlinck, Joyzelle"
  ],
  [
    "The wave of the future is coming and there is no fighting it.",
    "Anne Morrow Lindbergh, The Wave of the Future (1940)"
  ],
  [
    "The never-ending flight<br />Of future days.",
    "John Milton, Paradise Lost (1667; 1674)"
  ],
  [
    "Oh, blindness to the future! kindly giv'n,<br />That each may fill the circle mark'd by heaven.",
    "Alexander Pope, An Essay on Man (1733-34)"
  ]
];

function randomFutureQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default randomFutureQuote;
