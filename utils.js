const easyvk = require("easyvk");
const { graph } = require("./constants");
async function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}



function perebor(start, where) {
  var n = graph.length;
  var queue = [];
  queue.push(start);
  var used = {}
  var p = {}
  var d = {}
  for (var key of Object.keys(graph)) {
    used[key] = false;
    p[key] = 0
    d[key] = 0
  }
  used[start] = true;
  p[start] = -1;

  while (queue.length) {
    var v = queue[0]
    //console.log(v, queue.length)
    queue.shift()
    for (var i of Object.keys(graph[v])) {
      var to = i
      if (!used[to]) {
        used[to] = true
        queue.push(to)
        d[to] = d[v] + 1;
        p[to] = v;
      }

    }

  }

  if (!used[where])
    return [];
  else {
    var path = []
    for (var v = where; v != -1; v = p[v])
      path.push(v);
    path.reverse();

    var pathText = []

    for (var i = 0; i < path.length - 1; i += 1)
      pathText.push(graph[path[i]][path[i + 1]])

    return pathText;
  }
}

async function getLast3(vk, prev3) {
  let vkr = await vk.call('messages.getHistory', {
    offset: '0',
    count: '3',
    user_id: '-182985865',
    start_message_id: '-1'
  });
  let Last3 = []
  let Last3Text = []
  //console.log(vkr)
  vkr.items.forEach(element => Last3.push(element.id))
  vkr.items.forEach(element => Last3Text.push(element.text))
  if (prev3.length > 0)
    if (Last3[0] == prev3[0])
      return [];
    else
      return [Last3, Last3Text];
  else
    return [Last3, Last3Text];
}

async function getNewLast3(vk,prev)
{
  var nw = await getLast3(vk,prev)
  while (nw.length == 0){
    console.log('boo')
    await sleep(1000);
    nw = await getLast3(vk,prev)
    //console.log("gettin' new")
  }
  return nw;
  //Last3 = nw[0]
  //Last3Text = nw[1]
}

async function goto3(vk,start,Where){
  var path = perebor(start, Where)
  console.log(path)
  for (var i of path){
    await sleep(300);
    await send(vk,i); 
    // await getNewLast3(vk,Last3); 
    // console.log(Last3Text, "new")
    while (Last3Text[0].includes("Подождите") || Last3Text[0].includes("к точке") || Last3Text[0].includes(i) || Last3Text[0].includes("Простая"))
      await getNewLast3(vk,Last3);
    console.log(Last3Text, "newnew")
  }
  return Where;
}


module.exports = {
  sleep: sleep,
  //send: send,
  perebor: perebor,
  getLast3: getLast3,
  getNewLast3: getNewLast3,
  goto3: goto3
};