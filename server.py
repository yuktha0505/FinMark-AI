from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
import random
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

class AnomalyAnalysis(BaseModel):
    root_cause: str
    reasoning_steps: List[str]
    confidence: float
    financial_impact: str

class AnomalyAction(BaseModel):
    type: str
    target: str
    expected_impact: str

class AnomalyPlaybook(BaseModel):
    actions: List[AnomalyAction]

class AnomalyResponse(BaseModel):
    analysis: AnomalyAnalysis
    playbook: AnomalyPlaybook

# Anomaly Detection Endpoint
@api_router.post("/anomaly/trigger", response_model=AnomalyResponse)
async def trigger_anomaly_detection():
    """
    Trigger AI-powered anomaly detection on financial transactions.
    Returns analysis with root cause, reasoning steps, confidence score, and suggested actions.
    """
    
    # Simulate various anomaly scenarios
    scenarios = [
        {
            "root_cause": "Payment gateway timeout spike detected on Gateway A during peak transaction hours",
            "reasoning_steps": [
                "Analyzed 50,000 transactions in the last hour",
                "Detected 12% failure rate versus 2% baseline",
                "Identified Gateway A processing delays averaging 8.5 seconds",
                "Correlated with 85% increase in concurrent requests",
                "Root cause: Gateway A connection pool saturation"
            ],
            "confidence": 0.87,
            "financial_impact": "₹1.2L/day",
            "action": {
                "type": "reroute",
                "target": "Gateway B",
                "expected_impact": "+3%"
            }
        },
        {
            "root_cause": "Fraudulent transaction pattern detected from IP cluster in Eastern Europe",
            "reasoning_steps": [
                "Flagged 847 suspicious transactions from 23 IP addresses",
                "Pattern matches known card testing behavior",
                "Average transaction amount: ₹150 (below fraud alert threshold)",
                "95% of transactions attempted in 15-minute window",
                "High velocity micro-transactions indicate card validation attempts"
            ],
            "confidence": 0.94,
            "financial_impact": "₹2.8L/day",
            "action": {
                "type": "block",
                "target": "IP Range 185.220.x.x",
                "expected_impact": "+8%"
            }
        },
        {
            "root_cause": "Database query timeout causing payment confirmation delays",
            "reasoning_steps": [
                "Monitored 35,000 payment confirmations in last 2 hours",
                "Detected average query time increase from 120ms to 4.2 seconds",
                "Database index fragmentation at 78%",
                "Transaction table lock contention increased by 340%",
                "Root cause: Missing composite index on payment_status + created_at"
            ],
            "confidence": 0.91,
            "financial_impact": "₹950/hour",
            "action": {
                "type": "optimize",
                "target": "Database Index Rebuild",
                "expected_impact": "+5%"
            }
        },
        {
            "root_cause": "Currency conversion API rate limiting causing transaction failures",
            "reasoning_steps": [
                "Analyzed 12,000 cross-border transactions",
                "Detected 18% failure rate for USD/EUR conversions",
                "Currency API response time exceeded 10 seconds in 67% of cases",
                "Rate limit reached at 14:23 UTC (1000 requests/minute threshold)",
                "Fallback conversion service not activated"
            ],
            "confidence": 0.82,
            "financial_impact": "₹1.8L/day",
            "action": {
                "type": "switch",
                "target": "Backup Currency API",
                "expected_impact": "+4%"
            }
        }
    ]
    
    # Randomly select a scenario for variety
    scenario = random.choice(scenarios)
    
    response = AnomalyResponse(
        analysis=AnomalyAnalysis(
            root_cause=scenario["root_cause"],
            reasoning_steps=scenario["reasoning_steps"],
            confidence=scenario["confidence"],
            financial_impact=scenario["financial_impact"]
        ),
        playbook=AnomalyPlaybook(
            actions=[AnomalyAction(**scenario["action"])]
        )
    )
    
    logger.info(f"Anomaly detection triggered: {scenario['root_cause']}")
    
    return response
# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
