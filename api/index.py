import sys
import os

# Add backend directory to python sys.path so app modules import cleanly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app  # noqa: F401
