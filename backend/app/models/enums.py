import enum


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    SECURITY_ENGINEER = "SECURITY_ENGINEER"
    DEVELOPER = "DEVELOPER"
    VIEWER = "VIEWER"

class UserStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"

class OrgTier(str, enum.Enum):
    FREE = "FREE"
    TEAM = "TEAM"
    ENTERPRISE = "ENTERPRISE"

class MemberRole(str, enum.Enum):
    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"
    READ_ONLY = "READ_ONLY"

class RepoProvider(str, enum.Enum):
    GITHUB = "GITHUB"
    GITLAB = "GITLAB"
    BITBUCKET = "BITBUCKET"
    LOCAL = "LOCAL"

class ScanType(str, enum.Enum):
    SAST = "SAST"
    DAST = "DAST"
    DEPENDENCY = "DEPENDENCY"
    SECRET = "SECRET"
    FULL_AUDIT = "FULL_AUDIT"

class ScanStatus(str, enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class SeverityLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

class FindingStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_REVIEW = "IN_REVIEW"
    RESOLVED = "RESOLVED"
    FALSE_POSITIVE = "FALSE_POSITIVE"
    IGNORED = "IGNORED"
