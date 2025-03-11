"use server"


const GMAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getAddress(addresses: string[]) {
  const directionURL: string ="https://www.google.com/maps/dir/"
  const newAddress = addresses.map( address => encodeURIComponent(address)).join("/")
  const embed = getMapsEmbed(addresses[0], addresses.slice(1, -1), addresses[addresses.length - 1])
  return {url: directionURL + newAddress, embed: embed};
}

export async function getMapsEmbed(origin: string, waypoints: string[], end_area: string){
  //URL is currently only formatted to work for Sragvee's local IP
  console.log(origin, end_area, waypoints)
  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GMAPS_API_KEY}&origin=${origin}&mode=driving&units=imperial${waypoints.length != 0 ? `&waypoints=${waypoints}` : ''}&maptype=roadmap&destination=${end_area}&avoid=tolls` 
  return embedUrl;
}