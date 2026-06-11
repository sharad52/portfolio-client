import { ApiService } from '@/core/api/apiClient';
import { PaginatedResponse, PaginationParams } from '@/shared/types/common';
import { BlogPost, BlogFilters, BlogComment } from '../types';

// Mock data for now - will be replaced with real API calls
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-react-typescript',
    excerpt: 'Learn how to set up a React project with TypeScript and best practices for type-safe development.',
    content: `React and TypeScript have become the default stack for serious frontend work — but "adding TypeScript" to a React project is where most teams stop, long before they get the real payoff. The value isn't in sprinkling \`: string\` on a few props; it's in letting the compiler model your UI so that entire categories of bugs become *unrepresentable*. Here are the insights that moved the needle for me.

## Type props with interfaces, skip React.FC

For years the convention was \`const Button: React.FC<Props>\`. Drop it. \`React.FC\` implicitly adds a \`children\` prop even when your component takes none, makes generic components awkward, and buys you almost nothing in return.

\`\`\`tsx
// Avoid — children is always allowed, generics are painful
const Card: React.FC<CardProps> = ({ title }) => <h3>{title}</h3>;

// Prefer — explicit, honest about what the component accepts
interface CardProps {
  title: string;
  children?: React.ReactNode; // opt in only when you mean it
}

function Card({ title, children }: CardProps) {
  return <section><h3>{title}</h3>{children}</section>;
}
\`\`\`

You stay in control of whether \`children\` exists, and generic components (below) just work.

## Let inference do the work

A common beginner reflex is to annotate everything. TypeScript is far better at inference than people expect — over-annotating adds noise and can even *weaken* types. Annotate the **inputs** (props, function parameters, \`useState\` when the initial value is ambiguous) and let the **outputs** be inferred.

\`\`\`tsx
const [count, setCount] = useState(0);        // inferred as number — good
const [user, setUser] = useState<User | null>(null); // annotate: null alone is too narrow

// No return annotation needed — TS infers Promise<User>
async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise<User>;
}
\`\`\`

## Model state with discriminated unions

This is the single highest-leverage pattern. Most "loading / error / data" bugs come from representing state as a bag of optional fields, which lets impossible combinations exist (\`loading: true\` *and* \`error\` *and* \`data\` all at once). A discriminated union makes the illegal states unreachable.

\`\`\`tsx
// Fragile — what does { loading: true, data: {...}, error: '...' } even mean?
type State = { loading: boolean; data?: User; error?: string };

// Robust — exactly one shape is valid at a time
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; message: string };

function View({ state }: { state: State }) {
  switch (state.status) {
    case 'loading': return <Spinner />;
    case 'error':   return <Error msg={state.message} />;
    case 'success': return <Profile user={state.data} />; // data is guaranteed here
    default:        return <Idle />;
  }
}
\`\`\`

Inside the \`success\` branch, \`state.data\` is known to exist — no optional chaining, no \`!\` assertions, no runtime guard.

## Reach for generics in reusable components

When a component passes a value straight through — a list, a select, a table — generics let it stay fully typed without resorting to \`any\`.

\`\`\`tsx
interface ListProps<T> {
  items: T[];
  render: (item: T) => React.ReactNode;
}

function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{render(item)}</li>)}</ul>;
}

// T is inferred as User — render's argument is fully typed
<List items={users} render={(u) => u.email} />;
\`\`\`

## Type events and refs precisely

Reaching for \`any\` on an event handler throws away the safety you're paying for. The DOM types are already there.

\`\`\`tsx
function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value); // .value is known to be a string
}

const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus(); // null-checked, because refs start null
\`\`\`

## Derive types, don't duplicate them

Keep a single source of truth and let TypeScript compute the rest with \`as const\`, \`keyof\`, and \`typeof\`. When the data changes, the types follow automatically.

\`\`\`tsx
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'editor' | 'viewer'
\`\`\`

## The takeaway

TypeScript pays off when you treat it as a **design tool**, not a linter. Make impossible states impossible, lean on inference, and derive types from data. Do that and the compiler stops being a tax you pay and starts being the teammate that catches the bug before your users do.`,
    coverImage: '/images/react.jpg',
    author: {
      id: '1',
      name: 'Er. Sharad Bhandari',
      avatar: '/images/about-photo.jpg',
    },
    tags: [
      { id: '1', name: 'React', slug: 'react' },
      { id: '2', name: 'TypeScript', slug: 'typescript' },
    ],
    category: { id: '1', name: 'Frontend', slug: 'frontend' },
    published: true,
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 5,
    views: 1234,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Name Mangling in Python: The Double Underscore Explained',
    slug: 'name-mangling-in-python',
    excerpt:
      'Why __attribute becomes _ClassName__attribute, how it protects subclasses from accidental overrides, and the gotchas every Python developer should know.',
    content: `# Name Mangling in Python

If you have ever prefixed a class attribute with two leading underscores and then been surprised that \`obj.__secret\` raises an \`AttributeError\`, you have met **name mangling**. It is one of Python's quieter features, but understanding it makes class design and inheritance far less mysterious.

## What is name mangling?

Name mangling is a compile-time transformation the Python interpreter applies to any identifier inside a class body that has **two leading underscores and at most one trailing underscore** (e.g. \`__value\`, \`__compute\`). The interpreter rewrites that name to \`_ClassName__value\`.

\`\`\`python
class Account:
    def __init__(self, balance):
        self.__balance = balance        # stored as _Account__balance

    def show(self):
        return self.__balance            # rewritten to self._Account__balance


acc = Account(100)
print(acc.show())          # 100  ✅
print(acc._Account__balance)  # 100  ✅ (the real attribute name)
print(acc.__balance)       # ❌ AttributeError: 'Account' object has no attribute '__balance'
\`\`\`

The attribute was never named \`__balance\` at runtime — the compiler renamed it before the class object was ever created.

## Why does Python do this?

Name mangling is **not** about privacy or security — it is about avoiding *accidental name clashes* in inheritance hierarchies. A subclass can define its own \`__cache\` without ever stomping on a parent's \`__cache\`, because each one is mangled with its own class name.

\`\`\`python
class Base:
    def __init__(self):
        self.__data = "base"      # _Base__data

    def base_data(self):
        return self.__data


class Child(Base):
    def __init__(self):
        super().__init__()
        self.__data = "child"     # _Child__data — a DIFFERENT attribute

    def child_data(self):
        return self.__data


c = Child()
print(c.base_data())   # "base"   — untouched
print(c.child_data())  # "child"  — independent
print(vars(c))         # {'_Base__data': 'base', '_Child__data': 'child'}
\`\`\`

Both attributes coexist peacefully. Without mangling, \`Child\`'s assignment would silently overwrite \`Base\`'s.

## The exact rules

Name mangling kicks in **only** when *all* of these hold:

1. The identifier appears **textually inside a class body**.
2. It has **two or more leading underscores**.
3. It has **at most one trailing underscore**.

That last rule is why **dunder** (double-underscore) methods like \`__init__\`, \`__str__\`, and \`__len__\` are *not* mangled — they have two trailing underscores, so they are excluded by design.

\`\`\`python
class Demo:
    __mangled = 1      # -> _Demo__mangled
    __dunder__ = 2     # -> __dunder__   (NOT mangled, two trailing underscores)
    _single = 3        # -> _single      (NOT mangled, one leading underscore)
    __ = 4             # -> __           (NOT mangled, no name after the underscores)
\`\`\`

## Single vs. double underscore — the convention

| Prefix | Example | Meaning | Enforced? |
| --- | --- | --- | --- |
| \`_name\` | \`_cache\` | "internal, please don't touch" | No — convention only |
| \`__name\` | \`__cache\` | name-mangled to avoid subclass clashes | Yes — by the compiler |
| \`__name__\` | \`__init__\` | special / dunder method | Not mangled |

A **single** leading underscore is a *gentleman's agreement*: it signals "internal use" but Python does nothing to stop you. The **double** underscore actively rewrites the name.

## Common gotchas

**1. It is not truly private.** Anyone can still reach the attribute via its mangled name. Mangling discourages, it does not protect:

\`\`\`python
acc._Account__balance = 999   # perfectly legal
\`\`\`

**2. \`getattr\`/\`setattr\` with the original string fails.** Because the rename happens at compile time on *literal* identifiers, dynamic access must use the mangled name:

\`\`\`python
getattr(acc, '__balance')          # ❌ AttributeError
getattr(acc, '_Account__balance')  # ✅ 100
\`\`\`

**3. Mangling uses the *class where the code is written*, not the runtime type.** A method defined in \`Base\` always mangles to \`_Base__x\`, even when called on a \`Child\` instance.

**4. It breaks naive \`__getattr__\` proxies and some serialization.** Tools that walk \`__dict__\` will see the mangled keys, which can surprise ORMs, serializers, and \`dataclasses\`.

## When should you actually use it?

Reach for double underscores when you are writing a **base class meant to be subclassed** and you have an attribute that is a genuine implementation detail you do **not** want a subclass to override by accident. For everything else — including "I just want to signal private" — prefer a **single** underscore. It is simpler, plays nicely with tooling, and is the overwhelming convention in real-world Python.

## Key takeaways

- \`__name\` inside a class becomes \`_ClassName__name\` at compile time.
- Its purpose is **collision avoidance in inheritance**, not access control.
- Dunder names (\`__x__\`) are exempt.
- It is a convention backed by a rename — not real privacy. Use single underscore unless you specifically need subclass-safe attributes.`,
    coverImage: '/images/python.jpg',
    author: {
      id: '1',
      name: 'Er. Sharad Bhandari',
      avatar: '/images/about-photo.jpg',
    },
    tags: [
      { id: '3', name: 'Python', slug: 'python' },
      { id: '4', name: 'OOP', slug: 'oop' },
    ],
    category: { id: '2', name: 'Backend', slug: 'backend' },
    published: true,
    publishedAt: '2026-06-11T10:00:00Z',
    readingTime: 7,
    views: 0,
    createdAt: '2026-06-11T10:00:00Z',
    updatedAt: '2026-06-11T10:00:00Z',
  },

  /* ── Python / Backend ─────────────────────────────────────────── */
  {
    id: '3',
    title: 'Async Python in Production: asyncio Patterns That Scale',
    slug: 'async-python-asyncio-patterns',
    excerpt: 'async is not a performance cheat code. The event-loop, concurrency, and timeout patterns that hold up under real traffic.',
    content: `Async Python went from a niche feature to the backbone of frameworks like FastAPI and aiohttp. But \`async\` is not a performance cheat code — used carelessly it makes services *slower* and harder to debug. These are the patterns that hold up under real traffic.

## Never block the event loop

The single most common mistake: calling synchronous, blocking code inside a coroutine. One blocking call freezes *every* concurrent request on that worker.

\`\`\`python
import asyncio

# Bad — requests is synchronous; it blocks the whole loop
async def fetch_bad(url):
    return requests.get(url).json()

# Good — offload blocking work to a thread pool
async def fetch_ok(url):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, lambda: requests.get(url).json())
\`\`\`

Better still, use an async-native client like \`httpx.AsyncClient\` or \`aiohttp\`.

## Bound your concurrency

\`asyncio.gather\` happily launches 10,000 coroutines at once and stampedes your database. Gate concurrency with a \`Semaphore\`.

\`\`\`python
sem = asyncio.Semaphore(20)

async def fetch(client, url):
    async with sem:                 # at most 20 in flight
        r = await client.get(url)
        return r.json()
\`\`\`

## Prefer TaskGroup (3.11+)

\`gather\` leaks tasks when one fails. \`TaskGroup\` gives structured concurrency: if any child raises, siblings are cancelled and errors propagate cleanly.

\`\`\`python
async with asyncio.TaskGroup() as tg:
    tg.create_task(worker_a())
    tg.create_task(worker_b())
# both finished — or the block raised an ExceptionGroup
\`\`\`

## Always set timeouts

A hung upstream should never hang your service. Wrap awaits in \`asyncio.timeout\`.

\`\`\`python
async with asyncio.timeout(5):
    data = await slow_call()
\`\`\`

## The takeaway

Async buys you concurrency for **I/O-bound** work — not CPU-bound work, and not for free. Keep the loop unblocked, cap concurrency, lean on TaskGroup, and put a timeout on everything that touches the network.`,
    coverImage: '/images/python.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '3', name: 'Python', slug: 'python' }, { id: '5', name: 'asyncio', slug: 'asyncio' }],
    category: { id: '2', name: 'Backend', slug: 'backend' },
    published: true,
    publishedAt: '2026-06-05T10:00:00Z',
    readingTime: 6,
    views: 1820,
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-06-05T10:00:00Z',
  },
  {
    id: '4',
    title: 'FastAPI vs Django Ninja: Type-Safe Python APIs in 2026',
    slug: 'fastapi-vs-django-ninja',
    excerpt: 'Both give you Pydantic-powered, auto-documented APIs. Choosing between them is really a choice about the ecosystem around your endpoints.',
    content: `Both FastAPI and Django Ninja give you the same headline feature — Pydantic-powered, type-hinted APIs with automatic OpenAPI docs. Choosing between them is really a choice about the *ecosystem* you want around your endpoints.

## The shared idea

Both turn type hints into validation, serialization, and docs:

\`\`\`python
# FastAPI
@app.post("/items")
def create(item: ItemIn) -> ItemOut:
    return service.create(item)

# Django Ninja — nearly identical surface
@router.post("/items", response=ItemOut)
def create(request, item: ItemIn):
    return service.create(item)
\`\`\`

## When FastAPI wins

- **Greenfield, async-first services.** First-class \`async def\`, an ASGI core, and a lean dependency-injection system make it ideal for microservices and ML inference APIs.
- **You want minimal magic.** You assemble your own stack — SQLAlchemy/SQLModel, Alembic, auth.
- **Streaming, WebSockets, background tasks** are built in and ergonomic.

## When Django Ninja wins

- **You already have (or want) Django.** You get the ORM, migrations, admin, auth, and the whole battle-tested ecosystem — with a modern typed API layer bolted on.
- **CRUD-heavy products** where the admin panel and mature ORM save weeks.
- **Teams that value batteries-included** over assembling pieces.

## The honest trade-off

FastAPI is async-native; Django's ORM is still predominantly sync (improving, but partial). Django Ninja is fast, but you inherit Django's request lifecycle. FastAPI is lighter, but "bring your own everything" means more decisions.

## A simple decision rule

| Situation | Pick |
| --- | --- |
| New microservice, async I/O, ML serving | FastAPI |
| Existing Django app needing a typed API | Django Ninja |
| Content/CRUD product wanting admin + ORM | Django Ninja |
| Smallest possible dependency footprint | FastAPI |

## The takeaway

There's no wrong answer — both are excellent. Pick FastAPI for a focused, async service from scratch; pick Django Ninja for a modern API on top of Django's mature foundation. The deciding factor is rarely the API layer itself — it's everything *around* it.`,
    coverImage: '/images/python.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '3', name: 'Python', slug: 'python' }, { id: '6', name: 'FastAPI', slug: 'fastapi' }],
    category: { id: '2', name: 'Backend', slug: 'backend' },
    published: true,
    publishedAt: '2026-05-28T10:00:00Z',
    readingTime: 6,
    views: 2410,
    createdAt: '2026-05-28T10:00:00Z',
    updatedAt: '2026-05-28T10:00:00Z',
  },
  {
    id: '5',
    title: 'Python 3.13 Free-Threaded Mode: Life After the GIL',
    slug: 'python-313-free-threaded-gil',
    excerpt: 'Python 3.13 ships an official no-GIL build. What truly parallel threads unlock — and the catches to understand before you celebrate.',
    content: `For decades the Global Interpreter Lock (GIL) meant a single Python process could only run one thread of bytecode at a time. Python 3.13 ships an official **free-threaded** build (PEP 703) that can disable the GIL — the biggest change to CPython's execution model in its history.

## What actually changed

The free-threaded build (\`python3.13t\`) lets threads run Python bytecode *truly in parallel* across cores. CPU-bound multithreading — long impossible in pure Python — finally works.

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

def crunch(n):
    return sum(i * i for i in range(n))

# On free-threaded 3.13t this scales across cores;
# on the standard build the GIL serializes it.
with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(crunch, [10_000_000] * 8))
\`\`\`

## Why it matters

- **CPU-bound parallelism without multiprocessing** — no pickling, no process startup cost, shared memory by default.
- **Simpler architectures** for data processing, simulations, and ML pre/post-processing.

## The catch (read before celebrating)

- It's **experimental and opt-in.** The default 3.13 build still has the GIL.
- **Single-threaded code can be slower** in the free-threaded build due to lost GIL-era optimizations.
- **C extensions must be made compatible.** Many popular packages aren't yet — using them can crash or re-enable the GIL.
- **You now own thread-safety.** The GIL accidentally protected a lot of code; without it, data races are real.

## Should you use it today?

For most production apps in 2026: **not yet** as your default. Experiment for CPU-bound workloads, benchmark honestly, and verify every C dependency. The ecosystem is catching up fast.

## The takeaway

The no-GIL future is real and shipping — but it's a transition, not a switch. Know which build you're running, test for races, and treat free-threaded mode as a tool for specific CPU-bound problems rather than a universal speed-up.`,
    coverImage: '/images/python.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '3', name: 'Python', slug: 'python' }, { id: '7', name: 'Performance', slug: 'performance' }],
    category: { id: '2', name: 'Backend', slug: 'backend' },
    published: true,
    publishedAt: '2026-05-20T10:00:00Z',
    readingTime: 6,
    views: 3120,
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },

  /* ── AI / ML ──────────────────────────────────────────────────── */
  {
    id: '6',
    title: 'RAG in Production: Beyond Naive Vector Search',
    slug: 'rag-in-production',
    excerpt: 'A vector search and a prompt is a demo, not a system. Chunking, hybrid search, reranking, and grounding are what make RAG actually work.',
    content: `Retrieval-Augmented Generation looks trivial in a demo: embed some docs, run a similarity search, stuff the results into a prompt. In production that naive pipeline returns irrelevant chunks, hallucinates confidently, and frustrates users. Here's what separates a demo from a system.

## Chunking is the foundation

Garbage chunks mean garbage retrieval. Fixed-size splits cut sentences in half and destroy context.

\`\`\`python
# Naive — splits mid-sentence, loses structure
chunks = [text[i:i+500] for i in range(0, len(text), 500)]

# Better — respect structure, overlap to preserve context
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800, chunk_overlap=120,
    separators=["\\n## ", "\\n\\n", "\\n", ". "],
)
chunks = splitter.split_text(text)
\`\`\`

## Vector search alone isn't enough

Pure semantic search misses exact terms (IDs, error codes, names). **Hybrid search** — dense vectors plus keyword (BM25) — followed by a **reranker** dramatically improves relevance.

\`\`\`text
query -> [dense search] + [keyword search] -> merge -> rerank (cross-encoder) -> top 5
\`\`\`

## Retrieve, then re-rank

A first-stage retriever optimizes for recall (grab 50 candidates); a cross-encoder reranker optimizes for precision (pick the best 5). This two-stage pattern is the highest-ROI upgrade to a naive pipeline.

## Ground every answer

Cut hallucinations by instructing the model to answer *only* from context, cite sources, and say "I don't know" when retrieval is empty.

\`\`\`python
prompt = f"""Answer using ONLY the context. If the answer isn't there, say you don't know.
Cite sources as [1], [2].

Context:
{context}

Question: {question}"""
\`\`\`

## Measure it

You can't improve what you don't measure. Track retrieval hit-rate and answer faithfulness with an eval set before and after every change.

## The takeaway

Production RAG is a *retrieval* problem far more than a *generation* problem. Invest in chunking, hybrid search, and reranking; ground answers in cited context; and build an eval loop. The LLM is the easy part.`,
    coverImage: '/images/ai.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '8', name: 'LLM', slug: 'llm' }, { id: '9', name: 'RAG', slug: 'rag' }],
    category: { id: '3', name: 'AI/ML', slug: 'ai-ml' },
    published: true,
    publishedAt: '2026-05-12T10:00:00Z',
    readingTime: 7,
    views: 4280,
    createdAt: '2026-05-12T10:00:00Z',
    updatedAt: '2026-05-12T10:00:00Z',
  },
  {
    id: '7',
    title: 'Fine-Tuning vs RAG vs Prompting: Picking an LLM Strategy',
    slug: 'fine-tuning-vs-rag-vs-prompting',
    excerpt: '"Should we fine-tune?" is the most over-asked question in applied AI. A decision tree for matching the tool to the problem.',
    content: `"Should we fine-tune?" is the most over-asked question in applied AI. Usually the answer is no — at least not first. Fine-tuning, RAG, and prompt engineering solve different problems, and reaching for the heaviest tool first wastes time and money.

## What each one actually does

- **Prompting** changes *how* the model responds using instructions and examples. Zero training, instant iteration.
- **RAG** gives the model *knowledge* it didn't have — current, private, or domain data — at query time.
- **Fine-tuning** changes the model's *behavior and style* by training on examples. It teaches form, not facts.

## The decision tree

\`\`\`text
Need up-to-date or private knowledge?      -> RAG
Need a specific format / tone / structure? -> Fine-tune
Just need better instructions/examples?    -> Prompt engineering
Niche skill RAG can't feed?                -> Fine-tune (last resort)
\`\`\`

## Why fine-tuning is rarely step one

- It **doesn't add knowledge reliably** — for facts, RAG is cheaper and more current.
- It needs a **curated dataset**, retraining on model upgrades, and eval infrastructure.
- A strong prompt + RAG beats a fine-tune for most use cases in 2026.

## A pragmatic progression

1. Start with a clear, structured **prompt** and few-shot examples.
2. Hit a knowledge gap? Add **RAG**.
3. Still need consistent format or tone at scale? Now consider **fine-tuning** — often on outputs your prompt + RAG system already produces.

## They compose

These aren't mutually exclusive. A mature system often fine-tunes for tone, feeds the model RAG context, and wraps it all in a carefully engineered prompt.

## The takeaway

Default to prompting, add RAG for knowledge, and fine-tune only when you need behavioral consistency the other two can't deliver. Match the tool to the problem — knowledge vs. behavior vs. instruction — and you'll ship faster and spend less.`,
    coverImage: '/images/ai.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '8', name: 'LLM', slug: 'llm' }, { id: '10', name: 'AI', slug: 'ai' }],
    category: { id: '3', name: 'AI/ML', slug: 'ai-ml' },
    published: true,
    publishedAt: '2026-05-02T10:00:00Z',
    readingTime: 6,
    views: 3670,
    createdAt: '2026-05-02T10:00:00Z',
    updatedAt: '2026-05-02T10:00:00Z',
  },
  {
    id: '8',
    title: 'Building AI Agents with Tool Use: A Practical Guide',
    slug: 'building-ai-agents-tool-use',
    excerpt: 'An LLM that can act is an agent. The mechanism behind every agent framework is the same primitive — tool use. Here is how it works.',
    content: `An LLM that can only talk is a chatbot. An LLM that can *act* — call APIs, query databases, run code — is an agent. The mechanism behind every agent framework is the same primitive: **tool use** (a.k.a. function calling). Understand it and the magic disappears.

## The core loop

An agent is a loop: the model picks a tool, your code runs it, the result goes back, and the model decides what's next — until it produces a final answer.

\`\`\`text
user goal -> model picks a tool -> you execute it -> feed result back
          -> model picks next tool ... -> model returns final answer
\`\`\`

## Defining a tool

You describe tools as schemas; the model emits a structured call you execute.

\`\`\`python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a city",
    "input_schema": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"],
    },
}]

# The model responds with a tool_use block; you run the real function:
def get_weather(city: str) -> dict:
    return weather_api.current(city)
\`\`\`

## What makes agents reliable

- **Crisp tool descriptions.** The model only knows what your schema says. Vague descriptions cause wrong calls.
- **Narrow, composable tools** beat one mega-tool. \`search_orders\` + \`refund_order\` beats \`do_everything\`.
- **Validate inputs and handle errors** — return a useful message so the model can recover instead of crashing the loop.
- **Cap the iterations.** Always bound the loop to avoid runaway tool-calling.

## Guardrails matter

Tools are real side effects. Require confirmation for destructive actions, scope credentials tightly, and log every call. An agent with a \`delete_user\` tool and no guardrails is an incident waiting to happen.

## The takeaway

Agents aren't mysterious — they're a model in a loop with well-described tools. Invest in clear schemas, small composable tools, error handling, and guardrails, and you'll build agents that are useful *and* safe.`,
    coverImage: '/images/ai.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '11', name: 'AI Agents', slug: 'ai-agents' }, { id: '8', name: 'LLM', slug: 'llm' }],
    category: { id: '3', name: 'AI/ML', slug: 'ai-ml' },
    published: true,
    publishedAt: '2026-04-22T10:00:00Z',
    readingTime: 7,
    views: 5140,
    createdAt: '2026-04-22T10:00:00Z',
    updatedAt: '2026-04-22T10:00:00Z',
  },

  /* ── React / Frontend ─────────────────────────────────────────── */
  {
    id: '9',
    title: 'React Server Components: The Mental Model That Clicks',
    slug: 'react-server-components-mental-model',
    excerpt: 'RSC breaks the rule that components run in the browser. Once that clicks, smaller bundles and direct data access follow naturally.',
    content: `React Server Components (RSC) confuse people because they break a rule we internalized for a decade: "components run in the browser." With RSC, some components run *only* on the server and never ship to the client at all. Once that clicks, the rest follows.

## Two kinds of components

- **Server Components** (the default in the Next.js App Router) run on the server. They can hit the database directly, keep secrets, and send zero JavaScript to the browser.
- **Client Components** (\`"use client"\`) are the React you already know — they run in the browser and handle interactivity, state, and effects.

\`\`\`tsx
// Server Component — async, talks to the DB, ships no JS
async function ProductList() {
  const products = await db.product.findMany();
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Client Component — interactive
"use client";
function AddToCart({ id }: { id: string }) {
  const [adding, setAdding] = useState(false);
  return <button onClick={() => setAdding(true)}>Add</button>;
}
\`\`\`

## The mental model

The server builds the *static skeleton* and hands the browser small interactive islands. Data fetching moves to the server, next to your database; interactivity stays on the client.

## Why it matters

- **Smaller bundles** — server components add no client JS.
- **Direct data access** — no API layer just to read your own DB.
- **Secrets stay server-side** — API keys never reach the browser.

## The rules that trip people up

- Server Components **can't use** \`useState\`, \`useEffect\`, or event handlers.
- A Client Component **can't import** a Server Component, but it can receive one as \`children\`.
- \`"use client"\` marks a *boundary* — everything imported below it is client too.

## The takeaway

Stop asking "where does this component live?" and start asking "does this need interactivity or browser APIs?" If not, it's a Server Component — keep it on the server, ship less JS, and fetch data where it lives. RSC isn't a replacement for client React; it's a way to use far less of it.`,
    coverImage: '/images/react.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '12', name: 'React', slug: 'react' }, { id: '13', name: 'RSC', slug: 'rsc' }],
    category: { id: '1', name: 'Frontend', slug: 'frontend' },
    published: true,
    publishedAt: '2026-04-10T10:00:00Z',
    readingTime: 6,
    views: 6090,
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: '10',
    title: "You Don't Need useEffect: Modern React Data Fetching",
    slug: 'ditching-useeffect-data-fetching',
    excerpt: 'A huge share of effects in real codebases should not exist. How to fetch, derive, and reset without reaching for useEffect.',
    content: `\`useEffect\` is the most overused hook in React. A huge share of the effects in real codebases shouldn't exist — they fetch data, sync state, or compute values that belong somewhere else. Removing them makes apps faster and less buggy.

## You don't need an effect to fetch data

The classic \`useEffect\` + \`useState\` fetch pattern has race conditions, no caching, and no retries. In 2026, use a data library or the framework's loader.

\`\`\`tsx
// Avoid — manual fetching, race conditions, refetch chaos
useEffect(() => {
  let active = true;
  fetch(\`/api/user/\${id}\`).then(r => r.json()).then(d => active && setUser(d));
  return () => { active = false; };
}, [id]);

// Prefer — TanStack Query handles caching, dedup, retries, staleness
const { data: user } = useQuery({
  queryKey: ['user', id],
  queryFn: () => fetch(\`/api/user/\${id}\`).then(r => r.json()),
});
\`\`\`

## You don't need an effect to transform data

If a value can be computed during render, compute it during render. No effect, no extra state.

\`\`\`tsx
// Avoid
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(\`\${first} \${last}\`), [first, last]);

// Prefer — just derive it
const fullName = \`\${first} \${last}\`;
\`\`\`

## You don't need an effect to reset state

Use a \`key\` to reset a component instead of syncing state in an effect.

\`\`\`tsx
<Profile key={userId} userId={userId} />  // remounts cleanly when userId changes
\`\`\`

## When effects ARE the right tool

Effects are for **synchronizing with external systems**: subscriptions, DOM measurements, analytics, timers, non-React widgets. That's it.

## The takeaway

Before writing \`useEffect\`, ask: am I synchronizing with something *outside* React? If not — derive it during render, fetch it with a query library, or reset it with a key. Fewer effects means fewer bugs.`,
    coverImage: '/images/react.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '12', name: 'React', slug: 'react' }, { id: '14', name: 'Hooks', slug: 'hooks' }],
    category: { id: '1', name: 'Frontend', slug: 'frontend' },
    published: true,
    publishedAt: '2026-03-28T10:00:00Z',
    readingTime: 5,
    views: 7320,
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-28T10:00:00Z',
  },
  {
    id: '11',
    title: 'React 19: The use() Hook and the Compiler Explained',
    slug: 'react-19-use-hook-compiler',
    excerpt: 'React 19 pushes you to write less — use() for async data, the compiler for performance, and Actions for forms. What actually changes.',
    content: `React 19 brings two changes that quietly reshape how you write components: the **\`use\` hook** and the **React Compiler**. Together they remove a lot of the ceremony React has accumulated.

## The use() hook

\`use\` lets you read a Promise or context directly in render — and unlike every other hook, you can call it conditionally and inside loops.

\`\`\`tsx
import { use, Suspense } from 'react';

function Profile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);   // suspends until resolved
  return <h1>{user.name}</h1>;
}

// Parent provides the promise and a fallback
<Suspense fallback={<Spinner />}>
  <Profile userPromise={fetchUser(id)} />
</Suspense>
\`\`\`

Paired with Suspense, \`use\` makes async data feel synchronous — no loading flags scattered through your component.

## The React Compiler

For years we hand-optimized renders with \`useMemo\`, \`useCallback\`, and \`React.memo\`. The React Compiler auto-memoizes at build time, so you can often **delete those entirely**.

\`\`\`tsx
// Before — manual memoization noise
const sorted = useMemo(() => sortItems(items), [items]);
const onClick = useCallback(() => select(id), [id]);

// After — the compiler memoizes for you; write plain code
const sorted = sortItems(items);
const onClick = () => select(id);
\`\`\`

## Other quality-of-life wins

- **Actions** and \`useActionState\` streamline form submission and pending states.
- **\`ref\` as a prop** — no more \`forwardRef\` boilerplate.
- **Document metadata** (\`<title>\`, \`<meta>\`) can be rendered anywhere.

## The catch

The compiler relies on you following the Rules of React. Code that mutates props or breaks purity is silently skipped — the included ESLint plugin flags violations, so run it.

## The takeaway

React 19 pushes you toward *writing less*: \`use\` for async data, the compiler for performance, and Actions for forms. Write plain, idiomatic components and let the tooling handle the optimization you used to do by hand.`,
    coverImage: '/images/react.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '12', name: 'React', slug: 'react' }, { id: '15', name: 'React 19', slug: 'react-19' }],
    category: { id: '1', name: 'Frontend', slug: 'frontend' },
    published: true,
    publishedAt: '2026-03-15T10:00:00Z',
    readingTime: 6,
    views: 8410,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },

  /* ── AWS / DevSecOps ──────────────────────────────────────────── */
  {
    id: '12',
    title: 'Shifting Security Left: SAST, SCA & Secrets in CI',
    slug: 'shifting-security-left-ci',
    excerpt: 'Catch vulnerabilities in the PR loop, not in production. The three pillars of CI security and how to make them bearable, not noisy.',
    content: `"Shifting security left" means catching vulnerabilities early — in the IDE and CI pipeline — instead of in a pre-release pentest or, worse, in production. In 2026 it's table stakes, and the tooling is mature enough that there's no excuse to skip it.

## The three pillars in CI

- **SAST** (Static Application Security Testing) scans *your* source for vulnerable patterns — SQL injection, XSS, unsafe deserialization.
- **SCA** (Software Composition Analysis) scans your *dependencies* for known CVEs — where most real-world risk actually lives.
- **Secrets scanning** catches API keys, tokens, and passwords before they're committed.

## Wire it into the pipeline

The goal: fail the build on new, high-severity findings — automatically, on every PR.

\`\`\`yaml
# GitHub Actions — fail fast on security issues
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependency audit (SCA)
        run: npm audit --audit-level=high
      - name: Static analysis (SAST)
        uses: github/codeql-action/analyze@v3
      - name: Secret scan
        uses: gitleaks/gitleaks-action@v2
\`\`\`

## Make it bearable, not noisy

Shift-left fails when it cries wolf. Teams disable scanners that block PRs with hundreds of low-severity findings.

- **Gate only on new, high/critical issues.** Don't block on the pre-existing backlog.
- **Triage and suppress** false positives with documented, reviewed exceptions.
- **Pin and auto-update** dependencies (Dependabot/Renovate) so SCA findings get fixed, not ignored.

## Don't forget the developer's machine

Pre-commit hooks (secrets scan, linting) catch issues before they ever reach CI — the fastest, cheapest feedback loop there is.

## The takeaway

Shifting left isn't about buying tools — it's about putting SAST, SCA, and secrets scanning in the PR loop and tuning them so developers trust the signal. Catch issues where they're cheap to fix: at the keyboard, not in the incident channel.`,
    coverImage: '/images/devops.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '16', name: 'DevSecOps', slug: 'devsecops' }, { id: '17', name: 'CI/CD', slug: 'ci-cd' }],
    category: { id: '4', name: 'DevSecOps', slug: 'devsecops' },
    published: true,
    publishedAt: '2026-03-01T10:00:00Z',
    readingTime: 6,
    views: 2980,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: '13',
    title: 'Scanning Terraform Before It Ships: IaC Security',
    slug: 'terraform-iac-security-scanning',
    excerpt: 'A single misconfigured resource can ship a public S3 bucket to thousands of machines in seconds. Scan IaC before it applies.',
    content: `Infrastructure as Code turned servers into version-controlled files — which means a single misconfigured Terraform resource can ship a public S3 bucket or a wide-open security group to thousands of machines in seconds. Scanning IaC *before* it applies is now essential.

## The risk is the default

Cloud resources often default to insecure. A few lines of HCL can expose data to the internet:

\`\`\`hcl
# Dangerous — open to the world
resource "aws_security_group" "web" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # SSH open to everyone
  }
}
\`\`\`

## Scan in the pipeline

Tools like **tfsec**, **Checkov**, and **Trivy** parse your Terraform and flag misconfigurations against hundreds of policies — no deploy required.

\`\`\`yaml
- name: Scan Terraform
  uses: aquasecurity/tfsec-action@v1
  # fails the build on findings like public buckets,
  # unencrypted volumes, and 0.0.0.0/0 ingress
\`\`\`

## Common findings worth gating on

- Public S3 buckets / objects
- Unencrypted storage and databases (encryption-at-rest off)
- Security groups open to \`0.0.0.0/0\`
- IAM policies with wildcard \`Action: "*"\`
- Disabled logging (CloudTrail, VPC flow logs)

## Policy as code

Go beyond built-in rules with **OPA/Conftest** or Sentinel to encode *your* org's standards:

\`\`\`rego
deny[msg] {
  input.resource_type == "aws_s3_bucket"
  not input.values.server_side_encryption_configuration
  msg = "S3 buckets must enable encryption at rest"
}
\`\`\`

## Plan-time, not just code-time

Scan the \`terraform plan\` output too — it catches issues that only appear after variables and modules resolve.

## The takeaway

Treat infrastructure like application code: scan it on every PR, gate on high-severity misconfigurations, and codify your own policies. Catching a public bucket in CI costs minutes; catching it after a breach costs everything.`,
    coverImage: '/images/devops.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '18', name: 'AWS', slug: 'aws' }, { id: '19', name: 'Terraform', slug: 'terraform' }],
    category: { id: '4', name: 'DevSecOps', slug: 'devsecops' },
    published: true,
    publishedAt: '2026-02-18T10:00:00Z',
    readingTime: 6,
    views: 3550,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: '14',
    title: 'Least-Privilege IAM on AWS: From Wildcards to Scoped Policies',
    slug: 'least-privilege-iam-aws',
    excerpt: 'IAM is where most AWS incidents begin. Replacing wildcards with scoped actions, ARNs, and conditions is the highest-impact control you have.',
    content: `IAM is where most AWS security incidents begin. An over-permissioned role or a leaked key with \`AdministratorAccess\` turns a small mistake into a full breach. Least privilege — granting only the permissions actually needed — is the single highest-impact control on AWS.

## The problem with wildcards

The most common (and most dangerous) anti-pattern: wildcard actions and resources.

\`\`\`json
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}
\`\`\`

This grants everything. Even \`s3:*\` on \`*\` lets a compromised credential read and delete every bucket in the account.

## Scope by action AND resource

Grant the specific actions on the specific ARNs the workload needs:

\`\`\`json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-app-uploads/*"
}
\`\`\`

## Add conditions for real scoping

Conditions tighten access further — by source IP, MFA, tags, or region.

\`\`\`json
"Condition": {
  "Bool": { "aws:MultiFactorAuthPresent": "true" },
  "StringEquals": { "aws:RequestedRegion": "us-east-1" }
}
\`\`\`

## Prefer roles over long-lived keys

Use IAM **roles** with temporary credentials (instance profiles, IRSA for EKS, OIDC for CI) instead of static access keys. Keys leak; short-lived role credentials expire.

## Right-size with data, not guesses

- **IAM Access Analyzer** generates least-privilege policies from real CloudTrail activity.
- **Unused-access findings** flag permissions and roles nobody uses — delete them.

## The takeaway

Start from zero and add only what's proven necessary. Replace wildcards with scoped actions and ARNs, add conditions, use roles instead of keys, and let Access Analyzer turn real usage into tight policies. Least privilege isn't a one-time cleanup — it's a habit enforced in review and tooling.`,
    coverImage: '/images/devops.jpg',
    author: { id: '1', name: 'Er. Sharad Bhandari', avatar: '/images/about-photo.jpg' },
    tags: [{ id: '18', name: 'AWS', slug: 'aws' }, { id: '20', name: 'IAM', slug: 'iam' }],
    category: { id: '4', name: 'DevSecOps', slug: 'devsecops' },
    published: true,
    publishedAt: '2026-02-05T10:00:00Z',
    readingTime: 6,
    views: 4120,
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
  },
];

export class BlogService {
  private static readonly BASE_PATH = '/blog';

  // Get all blog posts with pagination and filters
  static async getPosts(
    params?: PaginationParams & BlogFilters
  ): Promise<PaginatedResponse<BlogPost>> {
    // TODO: Replace with real API call when backend is ready
    // return ApiService.get<PaginatedResponse<BlogPost>>(`${this.BASE_PATH}/posts`, { params });
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredPosts = MOCK_POSTS.filter(post => {
          if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return (
              post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower)
            );
          }
          if (params?.category && post.category.slug !== params.category) {
            return false;
          }
          if (params?.tag && !post.tags.some(t => t.slug === params.tag)) {
            return false;
          }
          return true;
        });

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const paginated = filteredPosts.slice(start, start + limit);

        resolve({
          data: paginated,
          pagination: {
            page,
            limit,
            total: filteredPosts.length,
            totalPages: Math.ceil(filteredPosts.length / limit),
          },
        });
      }, 500);
    });
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost>(`${this.BASE_PATH}/posts/${slug}`);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find(p => p.slug === slug);
        resolve(post || null);
      }, 500);
    });
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogPost[]>(`${this.BASE_PATH}/posts/featured`, { params: { limit } });
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_POSTS.slice(0, limit));
      }, 500);
    });
  }

  // Create a new blog post (admin only)
  static async createPost(data: Partial<BlogPost>): Promise<BlogPost> {
    return ApiService.post<BlogPost>(`${this.BASE_PATH}/posts`, data);
  }

  // Update a blog post (admin only)
  static async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return ApiService.put<BlogPost>(`${this.BASE_PATH}/posts/${id}`, data);
  }

  // Delete a blog post (admin only)
  static async deletePost(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_PATH}/posts/${id}`);
  }

  // Get comments for a post
  static async getComments(_postId: string): Promise<BlogComment[]> {
    // TODO: Replace with real API call
    // return ApiService.get<BlogComment[]>(`${this.BASE_PATH}/posts/${postId}/comments`);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 500);
    });
  }

  // Add a comment to a post
  static async addComment(
    postId: string,
    data: { author: string; email: string; content: string; parentId?: string }
  ): Promise<BlogComment> {
    return ApiService.post<BlogComment>(`${this.BASE_PATH}/posts/${postId}/comments`, data);
  }
}
