from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models.user import User
from app.middleware.auth_middleware import get_current_user
from app.utils.response import success

router = APIRouter()

BOARD_EXAMS = {
    "usmle": {"name": "USMLE", "full_name": "United States Medical Licensing Examination", "country": "USA", "steps": ["Step 1", "Step 2 CK", "Step 3"]},
    "plab": {"name": "PLAB", "full_name": "Professional and Linguistic Assessments Board", "country": "UK", "steps": ["PLAB 1", "PLAB 2"]},
    "kenya_kmpdb": {"name": "KMPDB Exam", "full_name": "Kenya Medical Practitioners and Dentists Board", "country": "Kenya", "steps": ["Part 1", "Part 2"]},
    "nigeria_mdcn": {"name": "MDCN Exam", "full_name": "Medical and Dental Council of Nigeria", "country": "Nigeria", "steps": ["Part 1", "Part 2"]},
    "next_india": {"name": "NExT", "full_name": "National Exit Test India", "country": "India", "steps": ["NExT 1", "NExT 2"]},
    "mccqe": {"name": "MCCQE", "full_name": "Medical Council of Canada Qualifying Examination", "country": "Canada", "steps": ["Part I", "Part II"]},
    "amc": {"name": "AMC", "full_name": "Australian Medical Council", "country": "Australia", "steps": ["AMC MCQ", "AMC Clinical"]},
    "hpcsa": {"name": "HPCSA", "full_name": "Health Professions Council of South Africa", "country": "South Africa", "steps": ["Part A", "Part B"]},
    "approbation": {"name": "Approbation", "full_name": "German Medical Approbation / Staatsexamen", "country": "Germany", "steps": ["M1", "M2", "M3"]},
}


@router.get("")
async def list_exams(current_user: User = Depends(get_current_user)):
    return success([{"id": k, **v} for k, v in BOARD_EXAMS.items()])


@router.get("/{exam_type}")
async def get_exam(exam_type: str, current_user: User = Depends(get_current_user)):
    exam = BOARD_EXAMS.get(exam_type)
    if not exam:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Exam not found")
    return success({"id": exam_type, **exam})


@router.get("/{exam_type}/progress")
async def exam_progress(exam_type: str, current_user: User = Depends(get_current_user)):
    return success({"exam_type": exam_type, "readiness_pct": 0, "topics_covered": [], "recommended_next": []})
