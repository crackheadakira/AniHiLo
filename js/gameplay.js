let series1Title = document.getElementById('seriesTitle1')
let series1Img = document.getElementById('seriesImage1')

let series2Title = document.getElementById('seriesTitle2')
let series2Img = document.getElementById('seriesImage2')

series1Title.textContent = series1.title.romaji || series1.title.english;
series1Img.src = series1.coverImage.extraLarge;

series2Title.textContent = series2.title.romaji || series2.title.english;
series2Img.src = series2.coverImage.extraLarge;