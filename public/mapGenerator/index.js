const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let image = new Image()
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANfSURBVGhD7ZVNkhMxDIUT9rOCJeyG+x8IdrCEFQcI6pZHVvRvu9NDUfmqZnDaz9J7aoe5PHmyxrX9u3O73dpq53q92/036RaFeyAOoPVAMbN5FpgY2UwArz0R+EjPAvq4OMUFqwFIkx73rKcVzIN0qvdIHRCoNHdFEc8BPKeHVEfLUuDsh7Y8CKhIhgDwJGwJATDhmxMFmC6tXeIToH0+jmQYuiVpFt2k0+H1PTFoBq4QVEm7ngkmnPwOLI6/jjc1MnDnQ0jNl6itxw08zFMVROX+BqYrmqTV0oQaOKJPVa/QRL8Ur+ZQryatXAPU6OresFcy65puWvgpOiBZPQOwEqPC5P9CnMD9CQwEoFm+r2OBG8B89SID/KYwj74qHnaAihuyDqD+XTJsLbkVJLYi9EK88k5iJ3pk2wJ+VgJMuPTQNgjoInajABVPeGTCvRdePxeuCNG0fdDqwByJ6wE8NwAU0e4JcVB3dAMgpkUUV9wHZc0tXZPLzI5jAdJyiFeNoLOkNKuZdYSyf9Bq3YYYc/9nF79EXk3MAAgV6bWEmrcJtgRdiaY5gwGoFOm5DXro/iUWpgE4g7TPAcvuTczuPcBK6SL1Fnr8Hj2AHvlpQGtB27DY3gJL1Vf6GOloi580SXu31RuxHkg7ut8Bjk7iEfRL3YPA1MRN+wGtE+W4QHeagAryaoFds2npDSCHmNbUy0I2HW8gAPCgDDGiqcgwFuAozFkGBIPrG7qieQxlwdYo8YD5Lm3xh8e8ASgtGs9RLMJlYwHMBuIhjIdPaIVKnWoAcGm655D1ujIgFSDDV8jrTQ9T90BFU6QHMG0JUk3gbMtdGyrCS8Haq9wDCEWxGZ3aW0TuxaIC1gTa5zd4EfsKDbVJiatpfzGi2th3oNiM9xD94gpxVNjVgmqAuDSnrjTZTXb4Q1wLxt5Aim6zXWEGPuQyz1mR1QDbZJiDZjO7aRVNkeEAZuPFKZoUQ94Nr612TE+oie1WugJBEV0hEN9t8JP6DO3GARaJPWjcKyTGcI57TrFR6TsgwpxAfUx3AeJjsFuvexrSUDzshwYYvf2IrUvvzLFJdLvVAIgYyVCbX59f22rn449vbZUxOprhQaYv5/eXr23FqASYe6szZxAvCQ/w6ef3tnryn3K5/AX0oh+zm3CEGgAAAABJRU5ErkJggg=='

let pixelSize = 0

const rarity = [
    "#7EEF6D", // common
    "#FFE65D", // unusual
    "#455FCF", // rare
    "#7633CB", // epic
    "#C13328", // legendary
    "#1ED2CB", // mythic
    "#ff2b75", // ultra
    "#2affa3", // super
    "#ff7b29", // ancient
    "#d966e8", // omega
    "#333333", // ???
]

const dataTypes = {}
dataTypes["0 0 0"] = -1 // wall
dataTypes["255 242 0"] = 1 // player spawn
dataTypes["255 255 255"] = 2 // mob spawn
dataTypes["255 0 0"] = 3 // checkpoint

const mobTypes = {}
mobTypes["136 0 27"] = 1 // bubbles
mobTypes["236 28 36"] = 2 // lady baby dande
mobTypes["195 195 195"] = 3 // hornet crab demon
mobTypes["88 88 88"] = 4 // spider hel spider
mobTypes["255 127 39"] = 5 // centi
mobTypes["196 255 14"] = 6 // cac shrub

const pixels = []

function img2data(r, g, b) {
    let data = {
    }
    data.imgData = [r, g, b]
    if (dataTypes[`${r} ${g} ${b}`]) {
        data.spawnType = dataTypes[`${r} ${g} ${b}`]
    } else if (mobTypes[`${r} ${g} ${b}`]) {
        data.mobTable = mobTypes[`${r} ${g} ${b}`]
        data.spawnType = 2
    } else {
        data.spawnType = 2
        console.log(r, g, b)
    }
    return data
}

function checkAdj(data, score = 0) {
    let pixels = data.pixels
    let pixelsToCheck = data.pixelsToCheck

    for (let pixel of pixelsToCheck) {
        const x = pixel.x
        const y = pixel.y
        const host = pixel.host

        if (
            x - 1 >= 0
        ) if (
                pixels[x - 1][y].spawnType !== -1 && !pixels[x - 1][y].host
            ) {
                pixels[x - 1][y].host = host
                pixels[x - 1][y].score = score
                pixelsToCheck.push(pixels[x - 1][y])
            }

        if (
            x + 1 <= pixels.length
        ) if (
                pixels[x + 1][y].spawnType !== -1 && !pixels[x + 1][y].host
            ) {
                pixels[x + 1][y].host = host
                pixels[x + 1][y].score = score
                pixelsToCheck.push(pixels[x + 1][y])
            }

        if (
            y - 1 >= 0
        ) if (
                pixels[x][y - 1].spawnType !== -1 && !pixels[x][y - 1].host
            ) {
                pixels[x][y - 1].host = host
                pixels[x][y - 1].score = score
                pixelsToCheck.push(pixels[x][y - 1])
            }

        if (
            y + 1 <= pixels.length
        ) if (
                pixels[x][y + 1].spawnType !== -1 && !pixels[x][y + 1].host
            ) {
                pixels[x][y + 1].host = host
                pixels[x][y + 1].score = score
                pixelsToCheck.push(pixels[x][y + 1])
            }

        score++
    }

    return pixels
}

function pathFind(pixels, maxRarity) {
    let data = {
        pixels,
        pixelsToCheck: [],
        spawnPixels: [],
    }

    let maxScore = 0
    for (let x = 0; x < pixels.length; x++) {
        const row = pixels[x]
        for (let y = 0; y < row.length; y++) {
            const pixel = row[y]
            if (pixel.spawnType == 1) {
                data.pixelsToCheck.push({ pixel, x, y, host: { x, y }, rarity: 0, score: 0 })
            }
        }
    }

    data = checkAdj(data, 1)

    for (let x = 0; x < data.length; x++) {
        const row = data[x]
        for (let y = 0; y < row.length; y++) {
            if (row[y].spawnType !== 2) continue
            maxScore = Math.max(maxScore, row[y].score)
        }
    }

    for (let x = 0; x < pixels.length; x++) {
        const row = pixels[x]
        for (let y = 0; y < row.length; y++) {
            const pixel = row[y]
            if (!pixel.score) continue
            pixel.score += 250 * Math.pow(.99, Math.sin(pixel.score))
            let randomness = 150
            let score = pixel.score - Math.random() * randomness
            let dist = 1.025 * maxRarity / (maxScore - (pixels.length / 100))
            pixel.rarity = Math.max(0, Math.min(maxRarity, Math.round(score * dist)))
        }
    }
}

function drawMap(pixels) {
    for (let row of pixels) {
        for (let pixel of row) {
            ctx.save()
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.strokeStyle = ctx.fillStyle = rarity[pixels[pixel.x][pixel.y].rarity]
            ctx.rect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
    }
}

function data2map(pixels) {
    const finalArr = []

    for (let row of pixels) {
        const rowNum = finalArr.push([]) - 1
        for (let pixel of row) {
            const data = {
                type: pixel.spawnType
            }
            data.rarity = pixel.rarity
            if (pixel.mobTable) data.specialId = pixel.mobTable
            finalArr[rowNum].push(data)
        }
    }

    console.log(finalArr)

    let f = btoa(JSON.stringify(finalArr))

    return f
}

image.onload = () => {

    pixelSize = window.innerHeight / image.height

    canvas.width = image.width * pixelSize
    canvas.height = image.height * pixelSize

    ctx.drawImage(image, 0, 0)
    const imgData = ctx.getImageData(0, 0, image.width, image.height).data

    for (let i = 0; i < imgData.length; i += 4) {
        const x = (i / 4) % image.width
        const y = Math.floor(i / (image.width * 4))

        if (!pixels[x]) pixels[x] = new Array(image.width)
        pixels[x][y] = img2data(imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3])
        pixels[x][y].x = x
        pixels[x][y].y = y
    }

    pathFind(pixels, 7)

    drawMap(pixels)

    console.log(data2map(pixels))
}