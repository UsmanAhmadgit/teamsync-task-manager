import { DndContext, PointerSensor, useDroppable, useDraggable, useSensor, useSensors } from '@dnd-kit/core';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

function DraggableCard({ task, onOpen, isDragDisabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { taskId: task.id, status: task.status },
    disabled: isDragDisabled,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen?.(task)}
      className={`rounded-2xl border border-border bg-card-glass p-4 text-sm shadow-card transition ${
        isDragging
          ? 'opacity-70'
          : isDragDisabled
            ? 'opacity-80'
            : 'hover:border-primary/40'
      }`}
    >
      <div className="text-sm font-semibold text-foreground">{task.title}</div>
      {task.assignees?.length ? (
        <div className="mt-2 text-xs text-muted-foreground">
          {task.assignees.slice(0, 2).map((member) => member.name).join(', ')}
          {task.assignees.length > 2 ? ` +${task.assignees.length - 2}` : ''}
        </div>
      ) : (
        <div className="mt-2 text-xs text-muted-foreground">Unassigned</div>
      )}
    </div>
  );
}

function Column({ column, tasks, onOpen, canMoveTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{column.title}</p>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[240px] flex-1 flex-col gap-3 rounded-xl border border-dashed p-2 transition ${
          isOver ? 'border-primary/50 bg-primary/5' : 'border-border'
        }`}
      >
        {tasks.map((task) => (
          <DraggableCard
            key={task.id}
            task={task}
            onOpen={onOpen}
            isDragDisabled={canMoveTask ? !canMoveTask(task) : false}
          />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, onMoveTask, onOpenTask, canMoveTask }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const grouped = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.status === column.id);
    return acc;
  }, {});

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event) => {
        const overId = event.over?.id;
        const taskId = event.active?.data?.current?.taskId;
        const fromStatus = event.active?.data?.current?.status;
        if (!overId || !taskId || overId === fromStatus) return;
        onMoveTask?.(taskId, overId);
      }}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={grouped[column.id] || []}
            onOpen={onOpenTask}
            canMoveTask={canMoveTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
