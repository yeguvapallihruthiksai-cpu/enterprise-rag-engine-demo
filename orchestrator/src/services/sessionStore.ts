interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export class SessionStore {
  private readonly turns = new Map<string, ChatTurn[]>();

  getSession(sessionId: string) {
    return this.turns.get(sessionId) ?? [];
  }

  append(sessionId: string, turn: ChatTurn) {
    const history = this.getSession(sessionId);
    history.push(turn);
    this.turns.set(sessionId, history.slice(-8));
  }
}

