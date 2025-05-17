let initial = [{"title":"Bill Gates","author":"The Road Ahead","libraryID":1254},{"title":"Steve Jobs","author":"Walter Isaacson","libraryID":4264},{"title":"Mockingjay: The Final Book of The Hunger Games","author":"Suzanne Collins","libraryID":3245}]

const test = JSON.parse(initial)
 const sorted = test.sort((a,b)=>{
   return a-b
  // if(a.libraryID>b.libraryID){
  //   return `${b.title}-${b.author}-${b.libraryID}`
  // }else{
  //   return `${a.title}-${a.author}-${b.libraryID}`
  // }
 })
console.log(sorted)