from datetime import datetime, timedelta


def calculate_sm2(ease_factor: float, interval: int, repetitions: int, grade: int) -> dict:
    """
    SM-2 spaced repetition algorithm.
    grade: 0=Again, 1=Again, 2=Hard, 3=Good, 4=Easy, 5=Perfect
    """
    if grade < 3:
        new_interval = 1
        new_reps = 0
        new_ef = ease_factor
    else:
        new_ef = max(1.3, ease_factor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
        new_reps = repetitions + 1
        if repetitions == 0:
            new_interval = 1
        elif repetitions == 1:
            new_interval = 6
        else:
            new_interval = round(interval * new_ef)
        ease_factor = new_ef

    next_review = datetime.utcnow() + timedelta(days=new_interval)
    return {
        "ease_factor": new_ef if grade >= 3 else ease_factor,
        "interval_days": new_interval,
        "repetitions": new_reps,
        "next_review": next_review,
    }
