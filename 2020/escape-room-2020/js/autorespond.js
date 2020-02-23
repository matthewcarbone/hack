//remove all punctuation,make input lowercase.
// see if any of the words match --> pick the one with the highest match
// if no words match then revert to default
// if the response has a third value it triggers an event.
var responses2 = [
  ["hello", "Hi there intruder."],
  ["hi", "Hi there intruder."],
  ["yo", "Hi there intruder."],
  ["whats up", "The sky."],
  ["hey", "Hey is for horses."],
  ["hi", "Hi there intruder."],
  ["tell me", "I can't"],
  ["game", "I love games!", 0],
  ["whats the time", "Its 4am right? Its always 4am around here."],
  ["Whats the weather", "Cloudy with a chance of malware."],
  ["Who are you", "My name is Babble Bot and I am the AI in charge of guarding c0mrade's personal computer."]
]
