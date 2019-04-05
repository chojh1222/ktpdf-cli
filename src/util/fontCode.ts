export const getFontCode = (font: string): string => {
    if(font === 'Dotum') {
        return 'F01';
    }
    else if(font === 'Gulim') {
        return 'F02';
    }
    return undefined;
}

export const getFont = (fontCode : string): string => {
    if(fontCode === 'F01') {
        return 'Dotum';
    }
    else if(fontCode === 'F02') {
        return 'Gulim';
    }
    return undefined;
}

export const fontList = [
    // {fontFamily: 'Times-Roman', fontName: 'Times-Roman'},
    // {fontFamily: 'Courier-Bold', fontName: 'Courier-Bold'},
    // {fontFamily: 'Dotum', fontName: '돋움'},
    // {fontFamily: "'Noto Sans KR', sans-serif", fontName: '본고딕'},
    // {fontFamily: "'Noto Serif KR', serif", fontName: '본명조'},
    // {fontFamily: '"맑은고딕","Malgun Gothic", serif', fontName: '맑은 고딕'},
    // {fontFamily: "'Nanum Gothic', sans-serif", fontName: '나눔고딕'},
    // {fontFamily: "'Nanum Myeongjo', serif", fontName: '나눔명조'},
    {fontFamily: "Nanum Gothic", fontName: '나눔고딕'},
    {fontFamily: "Nanum Myeongjo", fontName: '나눔명조'},
    // {fontFamily: 'Batang', fontName: '바탕'},
    // {fontFamily: 'Gulim', fontName: '굴림'},
    // {fontFamily: 'Batang', fontName: '바탕'},
    // {fontFamily: 'Gungsuh', fontName: '궁서'},
];

export const fontSizeList = [12, 14, 16, 18, 20, 24];