import "./EmptyState.css";
import Button from "../Button/Button";

function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
