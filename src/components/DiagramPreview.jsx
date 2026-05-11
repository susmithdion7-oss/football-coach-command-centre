const emptyObjects = []

export function createEmptyDiagram(title = 'Activity diagram') {
  return {
    title,
    notes: '',
    objects: [],
  }
}

export function normaliseDiagram(diagram, title = 'Activity diagram') {
  return {
    ...createEmptyDiagram(title),
    ...(diagram || {}),
    objects: Array.isArray(diagram?.objects) ? diagram.objects : emptyObjects,
  }
}

function PitchLines() {
  return (
    <>
      <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
      <line className="diagram-pitch-line" x1="50" y1="2" x2="50" y2="58" />
      <circle className="diagram-pitch-line" cx="50" cy="30" r="8" />
      <circle className="diagram-pitch-spot" cx="50" cy="30" r="0.7" />
      <rect className="diagram-pitch-line" x="2" y="18" width="14" height="24" />
      <rect className="diagram-pitch-line" x="84" y="18" width="14" height="24" />
      <rect className="diagram-pitch-line" x="2" y="24" width="6" height="12" />
      <rect className="diagram-pitch-line" x="92" y="24" width="6" height="12" />
    </>
  )
}

function DiagramObject({ object, selected }) {
  const highlightClass = selected ? ' selected' : ''

  if (object.type === 'area') {
    return (
      <rect
        className={`diagram-object diagram-area${highlightClass}`}
        height={object.height || 14}
        width={object.width || 24}
        x={object.x}
        y={object.y}
      />
    )
  }

  if (object.type === 'arrow' || object.type === 'line') {
    return (
      <g className={`diagram-object diagram-arrow${highlightClass}`}>
        <line
          markerEnd="url(#diagram-arrow-head)"
          x1={object.x}
          x2={object.x + (object.width || 18)}
          y1={object.y}
          y2={object.y + (object.height || -8)}
        />
      </g>
    )
  }

  if (object.type === 'cone') {
    return (
      <path
        className={`diagram-object diagram-cone${highlightClass}`}
        d={`M ${object.x} ${object.y - 2.4} L ${object.x - 2.4} ${object.y + 2.4} L ${object.x + 2.4} ${object.y + 2.4} Z`}
      />
    )
  }

  if (object.type === 'ball') {
    return (
      <g className={`diagram-object diagram-ball${highlightClass}`}>
        <circle cx={object.x} cy={object.y} r="2.7" />
        <path d={`M ${object.x - 1.4} ${object.y} H ${object.x + 1.4} M ${object.x} ${object.y - 1.4} V ${object.y + 1.4}`} />
      </g>
    )
  }

  return (
    <g className={`diagram-object diagram-player ${object.type}${highlightClass}`}>
      <circle cx={object.x} cy={object.y} r="3.3" />
      <text x={object.x} y={object.y + 1.1}>
        {object.label}
      </text>
    </g>
  )
}

function DiagramPreview({ diagram, selectedObjectId }) {
  const safeDiagram = normaliseDiagram(diagram)
  const hasObjects = safeDiagram.objects.length > 0

  return (
    <div className="diagram-preview-wrap">
      {!hasObjects && <p className="empty-message">No diagram added yet.</p>}
      {hasObjects && (
        <svg className="diagram-pitch diagram-preview" viewBox="0 0 100 60" role="img">
          <defs>
            <marker
              id="diagram-arrow-head"
              markerHeight="4"
              markerWidth="4"
              orient="auto"
              refX="3.5"
              refY="2"
            >
              <path d="M 0 0 L 4 2 L 0 4 Z" />
            </marker>
          </defs>
          <PitchLines />
          {safeDiagram.objects.map((object) => (
            <DiagramObject
              key={object.id}
              object={object}
              selected={object.id === selectedObjectId}
            />
          ))}
        </svg>
      )}
    </div>
  )
}

export default DiagramPreview
