import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Builder, By, until} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import Jimp from 'jimp';
import html2canvas from 'html2canvas';
import fs from 'fs';

async function fetchExerciseUrl() {
    try {
        const response = await fetch("https://leetcode.cn/");
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        let element_list = doc.getElementsByClassName("mt-4"); // 获取指定类的第27个元素
        let node_index = element_list.length-1;
        let node = element_list[node_index];
        let exercise_url = node.children[0].href;
        
        return exercise_url;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function fetchExerciseContent(url) {
    try {
        let options = new chrome.Options();
        options.addArguments("--headless");
        const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
        await driver.get(url);
        await driver.wait(until.elementLocated(By.className("elfjS")), 10000);
        let element = await driver.findElement(By.className("elfjS"));
        let rect = await element.getRect();
        
        // 调整窗口大小确保元素可见
        await driver.manage().window().setRect({ width: rect.width + 50, height: rect.height + 300 });

        // 截取整个浏览器窗口的截图
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync('screenshot.png', screenshot, 'base64');
        

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function main() {
    const exerciseUrl = await fetchExerciseUrl();
    console.log(exerciseUrl);
    await fetchExerciseContent(exerciseUrl);
    // console.log(nodeElem);
}

main();