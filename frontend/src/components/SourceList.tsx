export interface SourceItem {
  id: string;
  title: string;
  score: number;
  language: string;
  excerpt: string;
}

interface SourceListProps {
  sources: SourceItem[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <div className="sources-card">
      <h3>Sources</h3>
      <div className="source-list">
        {sources.map((source) => (
          <article className="source-item" key={source.id}>
            <div className="source-item-row">
              <strong>{source.title}</strong>
              <span>{Math.round(source.score * 100)}%</span>
            </div>
            <p>{source.excerpt}</p>
            <small>{source.language.toUpperCase()}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

