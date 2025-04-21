export interface Emotion{
    label:string,
    score:number
}

export interface EmotionData{
    start:number,
    end:number,
    text:string,
    emotions:Emotion[]
}