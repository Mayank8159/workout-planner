"""
Timezone utilities for IST (Indian Standard Time)
IST is UTC+5:30
"""
from datetime import datetime, timedelta, timezone

# Define IST timezone (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))


def get_ist_now() -> datetime:
    """
    Get current time in IST timezone
    
    Returns:
        datetime: Current datetime in IST
    """
    return datetime.now(IST)


def utc_to_ist(utc_dt: datetime) -> datetime:
    """
    Convert UTC datetime to IST
    
    Args:
        utc_dt: UTC datetime object
        
    Returns:
        datetime: IST datetime object
    """
    if utc_dt.tzinfo is None:
        # If naive datetime, assume it's UTC
        utc_dt = utc_dt.replace(tzinfo=timezone.utc)
    return utc_dt.astimezone(IST)


def ist_to_utc(ist_dt: datetime) -> datetime:
    """
    Convert IST datetime to UTC
    
    Args:
        ist_dt: IST datetime object
        
    Returns:
        datetime: UTC datetime object
    """
    if ist_dt.tzinfo is None:
        # If naive datetime, assume it's IST
        ist_dt = ist_dt.replace(tzinfo=IST)
    return ist_dt.astimezone(timezone.utc)


def format_ist_date(dt: datetime) -> str:
    """
    Format datetime to IST string
    
    Args:
        dt: datetime object
        
    Returns:
        str: Formatted IST datetime string
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=IST)
    else:
        dt = dt.astimezone(IST)
    return dt.strftime("%Y-%m-%d %I:%M %p IST")


def get_ist_date_string(dt: datetime = None) -> str:
    """
    Get date string in YYYY-MM-DD format for IST timezone
    
    Args:
        dt: datetime object (defaults to current IST time)
        
    Returns:
        str: Date string in YYYY-MM-DD format
    """
    if dt is None:
        dt = get_ist_now()
    elif dt.tzinfo is None:
        dt = dt.replace(tzinfo=IST)
    else:
        dt = dt.astimezone(IST)
    return dt.strftime("%Y-%m-%d")
