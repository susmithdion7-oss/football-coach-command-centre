const emptyObjects = []

export const pitchLayouts = [
  { value: 'fullPitch', label: 'Full pitch' },
  { value: 'halfPitch', label: 'Half pitch' },
  { value: 'smallSided', label: 'Small-sided pitch' },
  { value: 'blank', label: 'Blank training area' },
  { value: 'finalThird', label: 'Final third' },
]

const playerTypeDetails = {
  homePlayer: { prefix: 'H', label: 'Home Player' },
  awayPlayer: { prefix: 'A', label: 'Away Player' },
  neutralPlayer: { prefix: 'N', label: 'Neutral Player' },
}

export function createEmptyDiagram(title = 'Activity diagram') {
  return {
    title,
    notes: '',
    pitchLayout: 'fullPitch',
    objects: [],
  }
}

function getPlayerNumber(object, fallbackNumber) {
  if (object.number) {
    return String(object.number)
  }

  const prefix = playerTypeDetails[object.type]?.prefix || ''

  if (object.label?.startsWith(prefix)) {
    return object.label.slice(prefix.length) || String(fallbackNumber)
  }

  return String(fallbackNumber)
}

export function getObjectLabel(object) {
  if (object.type === 'homePlayer' || object.type === 'awayPlayer') {
    return String(object.number || object.label || '')
  }

  if (object.type === 'neutralPlayer') {
    return object.label || `N${object.number || ''}`
  }

  if (object.type === 'miniGoal') {
    return 'Mini Goal'
  }

  return object.type
}

export function getObjectTypeLabel(object) {
  return playerTypeDetails[object.type]?.label ||
    {
      ball: 'Ball',
      cone: 'Cone',
      miniGoal: 'Mini Goal',
      arrow: 'Arrow',
      line: 'Line',
      area: 'Area / Zone',
    }[object.type] ||
    'Object'
}

export function normaliseObject(object, index = 0) {
  if (!object || !object.type) {
    return null
  }

  const baseObject = {
    ...object,
    id: object.id || `${object.type}-${index}`,
  }

  if (object.type === 'homePlayer' || object.type === 'awayPlayer' || object.type === 'neutralPlayer') {
    const fallbackNumber =
      index + 1 || Number(object.label?.replace(/\D/g, '')) || 1
    const number = getPlayerNumber(object, fallbackNumber)
    const prefix = playerTypeDetails[object.type].prefix

    return {
      ...baseObject,
      x: object.x ?? 20,
      y: object.y ?? 20,
      number,
      label: object.label || `${prefix}${number}`,
      size: object.size || 4.2,
    }
  }

  if (object.type === 'ball') {
    return {
      ...baseObject,
      x: object.x ?? 50,
      y: object.y ?? 30,
      size: object.size || 3.2,
    }
  }

  if (object.type === 'cone') {
    return {
      ...baseObject,
      x: object.x ?? 45,
      y: object.y ?? 35,
      size: object.size || 4.2,
    }
  }

  if (object.type === 'miniGoal') {
    return {
      ...baseObject,
      x: object.x ?? 50,
      y: object.y ?? 10,
      size: object.size || 11,
      rotation: object.rotation || 0,
    }
  }

  if (object.type === 'arrow' || object.type === 'line') {
    return {
      ...baseObject,
      startX: object.startX ?? object.x ?? 35,
      startY: object.startY ?? object.y ?? 32,
      endX: object.endX ?? (object.x ?? 35) + (object.width || 18),
      endY: object.endY ?? (object.y ?? 32) + (object.height || -8),
      lineStyle: object.lineStyle || 'solid',
      colour: object.colour || '#101820',
      width: object.strokeWidth || object.widthValue || 1.2,
    }
  }

  if (object.type === 'area') {
    return {
      ...baseObject,
      x: object.x ?? 30,
      y: object.y ?? 20,
      width: object.width || 24,
      height: object.height || 14,
      label: object.label || '',
      colour: object.colour || '#ffffff',
      opacity: object.opacity || 0.22,
    }
  }

  return baseObject
}

export function normaliseDiagram(diagram, title = 'Activity diagram') {
  return {
    ...createEmptyDiagram(title),
    ...(diagram || {}),
    pitchLayout: diagram?.pitchLayout || 'fullPitch',
    objects: Array.isArray(diagram?.objects)
      ? diagram.objects.map(normaliseObject).filter(Boolean)
      : emptyObjects,
  }
}

export function PitchLines({ layout = 'fullPitch' }) {
  if (layout === 'blank') {
    return <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
  }

  if (layout === 'smallSided') {
    return (
      <>
        <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
        <line className="diagram-pitch-line" x1="50" y1="2" x2="50" y2="58" />
        <rect className="diagram-pitch-line" x="2" y="20" width="10" height="20" />
        <rect className="diagram-pitch-line" x="88" y="20" width="10" height="20" />
      </>
    )
  }

  if (layout === 'halfPitch') {
    return (
      <>
        <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
        <line className="diagram-pitch-line" x1="2" y1="58" x2="98" y2="58" />
        <rect className="diagram-pitch-line" x="28" y="2" width="44" height="18" />
        <rect className="diagram-pitch-line" x="40" y="2" width="20" height="8" />
        <circle className="diagram-pitch-spot" cx="50" cy="16" r="0.7" />
        <path className="diagram-pitch-line" d="M 38 20 Q 50 28 62 20" />
      </>
    )
  }

  if (layout === 'finalThird') {
    return (
      <>
        <rect className="diagram-pitch-border" x="2" y="2" width="96" height="56" rx="1" />
        <line className="diagram-pitch-line" x1="2" y1="52" x2="98" y2="52" />
        <rect className="diagram-pitch-line" x="24" y="2" width="52" height="24" />
        <rect className="diagram-pitch-line" x="38" y="2" width="24" height="10" />
        <circle className="diagram-pitch-spot" cx="50" cy="20" r="0.7" />
        <path className="diagram-pitch-line" d="M 35 26 Q 50 36 65 26" />
      </>
    )
  }

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

function PlayerMarker({ object, selected }) {
  const scale = (object.size || 4.2) / 4.2
  const displayText = object.type === 'neutralPlayer' ? object.label : object.number

  return (
    <g
      className={`diagram-object diagram-player ${object.type}${selected ? ' selected' : ''}`}
      transform={`translate(${object.x} ${object.y}) scale(${scale})`}
    >
      <circle className="diagram-player-head" cx="0" cy="-3" r="1.1" />
      <path className="diagram-player-shirt" d="M -2.4 -1.2 Q 0 -2.1 2.4 -1.2 L 1.8 3 L -1.8 3 Z" />
      <text className="diagram-player-number" x="0" y="1.15">
        {displayText}
      </text>
    </g>
  )
}

function BallMarker({ object, selected }) {
  const radius = object.size || 3.2

  return (
    <g className={`diagram-object diagram-ball${selected ? ' selected' : ''}`}>
      <circle cx={object.x} cy={object.y} r={radius} />
      <path
        d={`M ${object.x} ${object.y - radius * 0.42} L ${object.x + radius * 0.45} ${object.y - radius * 0.1} L ${object.x + radius * 0.28} ${object.y + radius * 0.45} L ${object.x - radius * 0.28} ${object.y + radius * 0.45} L ${object.x - radius * 0.45} ${object.y - radius * 0.1} Z`}
      />
      <path
        d={`M ${object.x - radius * 0.45} ${object.y - radius * 0.1} L ${object.x - radius * 0.95} ${object.y - radius * 0.35} M ${object.x + radius * 0.45} ${object.y - radius * 0.1} L ${object.x + radius * 0.95} ${object.y - radius * 0.35} M ${object.x - radius * 0.28} ${object.y + radius * 0.45} L ${object.x - radius * 0.6} ${object.y + radius * 0.85} M ${object.x + radius * 0.28} ${object.y + radius * 0.45} L ${object.x + radius * 0.6} ${object.y + radius * 0.85}`}
      />
    </g>
  )
}

function ConeMarker({ object, selected }) {
  const size = object.size || 4.2

  return (
    <g className={`diagram-object diagram-cone${selected ? ' selected' : ''}`}>
      <path
        d={`M ${object.x} ${object.y - size * 0.7} L ${object.x - size * 0.55} ${object.y + size * 0.55} L ${object.x + size * 0.55} ${object.y + size * 0.55} Z`}
      />
      <line x1={object.x - size * 0.3} x2={object.x + size * 0.3} y1={object.y + size * 0.08} y2={object.y + size * 0.08} />
    </g>
  )
}

function MiniGoalMarker({ object, selected }) {
  const size = object.size || 11
  const width = size
  const height = size * 0.46
  const depth = size * 0.34
  const postInset = width * 0.22

  return (
    <g
      className={`diagram-object diagram-mini-goal${selected ? ' selected' : ''}`}
      transform={`translate(${object.x} ${object.y}) rotate(${object.rotation || 0})`}
    >
      <path
        className="diagram-mini-goal-net-fill"
        d={`M ${-width / 2} ${-height / 2} H ${width / 2} L ${width / 2 - postInset} ${height / 2 + depth} H ${-width / 2 + postInset} Z`}
      />
      <path
        className="diagram-mini-goal-net-line"
        d={`M ${-width / 2 + postInset} ${height / 2 + depth} L ${-width / 2} ${-height / 2} M ${0} ${height / 2 + depth} L ${0} ${-height / 2} M ${width / 2 - postInset} ${height / 2 + depth} L ${width / 2} ${-height / 2}`}
      />
      <path
        className="diagram-mini-goal-net-line"
        d={`M ${-width / 2 + postInset * 0.6} ${height / 2 + depth * 0.35} H ${width / 2 - postInset * 0.6} M ${-width / 2 + postInset} ${height / 2 + depth * 0.7} H ${width / 2 - postInset}`}
      />
      <path
        className="diagram-mini-goal-frame"
        d={`M ${-width / 2} ${height / 2} V ${-height / 2} H ${width / 2} V ${height / 2}`}
      />
      <line className="diagram-mini-goal-frame" x1={-width / 2} x2={width / 2} y1={height / 2} y2={height / 2} />
      <line className="diagram-mini-goal-frame" x1={-width / 2 + postInset} x2={width / 2 - postInset} y1={height / 2 + depth} y2={height / 2 + depth} />
      <line className="diagram-mini-goal-side" x1={-width / 2} x2={-width / 2 + postInset} y1={height / 2} y2={height / 2 + depth} />
      <line className="diagram-mini-goal-side" x1={width / 2} x2={width / 2 - postInset} y1={height / 2} y2={height / 2 + depth} />
    </g>
  )
}

export function DiagramObject({
  object,
  onHandlePointerDown,
  onPointerDown,
  selected,
  showHandles = false,
}) {
  const highlightClass = selected ? ' selected' : ''
  const pointerProps = onPointerDown
    ? { onPointerDown: (event) => onPointerDown(event, object.id, 'move') }
    : {}

  if (object.type === 'area') {
    return (
      <g className={`diagram-object${highlightClass}`} {...pointerProps}>
        <rect
          className="diagram-area"
          height={object.height}
          width={object.width}
          x={object.x}
          y={object.y}
        />
        {object.label && (
          <text className="diagram-area-label" x={object.x + 2} y={object.y + 4}>
            {object.label}
          </text>
        )}
      </g>
    )
  }

  if (object.type === 'arrow' || object.type === 'line') {
    return (
      <g className={`diagram-object diagram-arrow ${object.lineStyle || 'solid'}${highlightClass}`}>
        <line
          markerEnd={object.type === 'arrow' ? 'url(#diagram-arrow-head)' : undefined}
          stroke={object.colour}
          strokeWidth={object.width}
          x1={object.startX}
          x2={object.endX}
          y1={object.startY}
          y2={object.endY}
          {...pointerProps}
        />
        {showHandles && selected && (
          <>
            <circle
              className="diagram-line-handle"
              cx={object.startX}
              cy={object.startY}
              r="1.8"
              onPointerDown={(event) => onHandlePointerDown(event, object.id, 'start')}
            />
            <circle
              className="diagram-line-handle"
              cx={object.endX}
              cy={object.endY}
              r="1.8"
              onPointerDown={(event) => onHandlePointerDown(event, object.id, 'end')}
            />
          </>
        )}
      </g>
    )
  }

  if (object.type === 'cone') {
    return <g {...pointerProps}><ConeMarker object={object} selected={selected} /></g>
  }

  if (object.type === 'ball') {
    return <g {...pointerProps}><BallMarker object={object} selected={selected} /></g>
  }

  if (object.type === 'miniGoal') {
    return <g {...pointerProps}><MiniGoalMarker object={object} selected={selected} /></g>
  }

  return <g {...pointerProps}><PlayerMarker object={object} selected={selected} /></g>
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
          <PitchLines layout={safeDiagram.pitchLayout} />
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
