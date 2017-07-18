/**
 * create random point in 50x50
 * @return {object} point
 */
const randPoint = function (){
  return {
    x: Math.random() * 50,
    y: Math.random() * 50,
  }
}

/**
 * create random line in 50x50
 * @return {object} line
 */
const randLine = function (){
  let pta = randPoint()
  let ptb = randPoint()
  return {
    bx: pta.x,
    by: pta.y,
    ex: ptb.x,
    ey: ptb.y,
  }
}

/**
 * create array of random lines in 50x50
 * @return {object[]} lines
 */
const randLines = function (){
  let lines = []
  for (let i = 0; i < 5000; ++i){
    lines.push(randLine())
  }
  return lines
}

/**
 * get intersection of 2 lines, using Cramer's Rule
 * @param {object} lnA line A
 * @param {object} lnB line B
 * @return {object} intersection
 */
const intersect = function (lnA, lnB){
  let r_px = lnA.bx
  let r_py = lnA.by
  let r_dx = lnA.ex - lnA.bx
  let r_dy = lnA.ey - lnA.by

  let s_px = lnB.bx
  let s_py = lnB.by
  let s_dx = lnB.ex - lnB.bx
  let s_dy = lnB.ey - lnB.by

  let H = s_dx * r_dy - r_dx * s_dy

  if (H === 0) return null

  let Hrt = s_dx * (s_py - r_py) - s_dy * (s_px - r_px)
  let Hst = r_dx * (s_py - r_py) - r_dy * (s_px - r_px)

  let rt = Hrt / H
  let st = Hst / H

  if (rt < 0 || rt > 1) return null
  if (st < 0 || st > 1) return null

  let x = r_px + r_dx * rt
  let y = r_py + r_dy * rt

  return { x, y }
}

/**
 * get z-component of 2d cross product
 * @param {number} ax x of vector A
 * @param {number} ay y of vector A
 * @param {number} bx x of vector B
 * @param {number} by y of vector B
 * @return {number} z-component
 */
const cross = function (ax, ay, bx, by){
  return ax * by - bx * ay
}

/**
 * return if straddling of one line on another
 * @param {object} lnA line A
 * @param {object} lnB line B
 * @return {bool} whether straddling
 */
const straddleSingle = function (lnA, lnB){
  let vax = lnB.bx - lnA.bx
  let vay = lnB.by - lnA.by

  let vbx = lnA.ex - lnA.bx
  let vby = lnA.ey - lnA.by

  let vcx = lnB.ex - lnA.bx
  let vcy = lnB.ey - lnA.by

  return cross(vax, vay, vbx, vby) * cross(vbx, vby, vcx, vcy) > 0
}

/**
 * return if straddling of 2 lines
 * @param {object} lnA line A
 * @param {object} lnB line B
 * @return {bool} whether straddling
 */
const straddle = function (lnA, lnB){
  return straddleSingle(lnA, lnB) && straddleSingle(lnB, lnA)
}

/**
 * get bouding rectangle of line
 * @param {object} line
 * @return {object}
 */
const rect = function (line){
  let r = {}
  if (line.bx > line.ex){
    r.bx = line.ex
    r.ex = line.bx
  }
  else {
    r.bx = line.bx
    r.ex = line.ex
  }
  if (line.by > line.ey){
    r.by = line.ey
    r.ey = line.by
  }
  else {
    r.by = line.by
    r.ey = line.ey
  }
  return r
}

/**
 * return if 2 lines are quick excluded
 * @param {object} lnA line A
 * @param {object} lnB line B
 * @return {bool} whether quick excluded
 */
const exclude = function (lnA, lnB){
  let ra = rect(lnA)
  let rb = rect(lnB)

  return
    (ra.bx > rb.ex) ||
    (ra.ex < rb.bx) ||
    (ra.by > rb.ey) ||
    (ra.ey < rb.by)
}

/**
 * test a function with lines
 * @param {function} func function to be tested
 * @param {object[]} lines lines for testing
 */
const testFunc = function (func, lines){
  let start = new Date
  console.log(`Testing ${func.name}...`)
  for (let lineA of lines){
    for (let lineB of lines){
      func(lineA, lineB)
    }
  }
  let elapsed = new Date - start
  console.log(`Tested ${func.name}: ${elapsed}ms`)
}

/**
 * test all functions with array of random lines
 */
const test = function (){
  let lines = randLines()
  testFunc(exclude, lines)
  testFunc(straddle, lines)
  testFunc(intersect, lines)
}

test()
