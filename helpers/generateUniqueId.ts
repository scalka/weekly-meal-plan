export function generateUniqueId() {
  // Generate a random number and convert it to a string
  const randomNumber = Math.floor(Math.random() * 1000000).toString();

  // Get the current timestamp and convert it to a string
  const timestamp = new Date().getTime().toString();

  // Concatenate the timestamp and random number to create a unique ID
  const uniqueId = timestamp + randomNumber;

  return uniqueId;
}
