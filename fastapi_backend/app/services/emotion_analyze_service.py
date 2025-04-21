from transformers import pipeline

classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base",return_all_scores=True)

def analyze_emotions(segments):
    print("analyze emotions func called..")
    
    response = [] 
    
    for segment in segments:
        text = segment.text  # ✅ fixed this
        start = segment.start
        end = segment.end
        scores = classifier(text)[0]
        
        sorted_scores = sorted(scores, key=lambda x: x['score'], reverse=True)
        
        obj = {
            "start": start,
            "end": end,
            "text": text,
            "emotions": sorted_scores
        }
        print("object: ", obj)  # ✅ fixed this too
        response.append(obj)
        
        print("function executed successfully")
        
    return response
