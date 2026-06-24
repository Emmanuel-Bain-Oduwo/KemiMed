import httpx
from app.config import settings
from loguru import logger


async def search_pubmed(query: str, max_results: int = 20, date_from: str = "", date_to: str = "") -> list[dict]:
    """Search PubMed and return structured article list."""
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json",
        "sort": "relevance",
    }
    if settings.PUBMED_API_KEY:
        params["api_key"] = settings.PUBMED_API_KEY
    if date_from and date_to:
        params["datetype"] = "pdat"
        params["mindate"] = date_from
        params["maxdate"] = date_to

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            search_resp = await client.get(f"{settings.PUBMED_BASE_URL}/esearch.fcgi", params=params)
            search_data = search_resp.json()
            ids = search_data.get("esearchresult", {}).get("idlist", [])
            if not ids:
                return []

            fetch_params = {
                "db": "pubmed",
                "id": ",".join(ids),
                "retmode": "json",
                "rettype": "abstract",
            }
            if settings.PUBMED_API_KEY:
                fetch_params["api_key"] = settings.PUBMED_API_KEY

            fetch_resp = await client.get(f"{settings.PUBMED_BASE_URL}/esummary.fcgi", params=fetch_params)
            fetch_data = fetch_resp.json()
            articles = []
            for pmid in ids:
                item = fetch_data.get("result", {}).get(pmid, {})
                if item:
                    articles.append({
                        "pmid": pmid,
                        "title": item.get("title", ""),
                        "authors": [a.get("name", "") for a in item.get("authors", [])],
                        "journal": item.get("fulljournalname", ""),
                        "year": item.get("pubdate", "")[:4],
                        "doi": next((e.get("value") for e in item.get("articleids", []) if e.get("idtype") == "doi"), None),
                    })
            return articles
    except Exception as e:
        logger.error(f"PubMed search error: {e}")
        return []


async def fetch_abstract(pmid: str) -> str:
    """Fetch full abstract for a PMID."""
    params = {
        "db": "pubmed",
        "id": pmid,
        "retmode": "text",
        "rettype": "abstract",
    }
    if settings.PUBMED_API_KEY:
        params["api_key"] = settings.PUBMED_API_KEY
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(f"{settings.PUBMED_BASE_URL}/efetch.fcgi", params=params)
            return resp.text
    except Exception as e:
        logger.error(f"PubMed fetch error: {e}")
        return ""
