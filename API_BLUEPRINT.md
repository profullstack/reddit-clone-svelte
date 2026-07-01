# Reddit Clone API Blueprint

The front end expects `API_BASE_URL` to point at a Reddit-like JSON API. For
local development, copy `env.sample` and set the base URL, for example:

```env
API_BASE_URL=http://localhost:8080
```

## Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/login` | Sign in and return a bearer token. |
| `POST` | `/register` | Create a new user account. |

Authenticated requests send the token with:

```http
Authorization: Bearer <token>
```

## Posts and Feeds

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | List posts for the home feed. Supports `sort`, `limit`, and cursor-style query params used by the UI. |
| `GET` | `/category/:category` | List posts for a category. |
| `GET` | `/users/:username` | List posts by a user. |
| `GET` | `/post/:postId` | Fetch a single post and its comments. |
| `POST` | `/posts` | Create a post. |
| `DELETE` | `/post/:postId` | Delete a post. |
| `POST` | `/post/:postId` | Add a comment to a post. |
| `DELETE` | `/post/:postId/:commentId` | Delete a comment. |
| `PUT` | `/post/:postId/:state` | Vote on a post. |
| `PUT` | `/post/:postId/:commentId/:state` | Vote on a comment. |
| `GET` | `/posts/rss` | RSS feed for posts. |
| `GET` | `/posts/:category/rss` | RSS feed for a category. |
| `GET` | `/user/:username/rss` | RSS feed for a user. |

Vote `state` values are expected to match the UI actions, such as `up`, `down`,
or a neutral state supported by the API.

## Categories

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/category` | Create a category. |

## User Settings

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/me` | Load the current user profile. |
| `PUT` | `/me` | Update the current user profile. |
| `PUT` | `/me/bitcoinaddress` | Update the current user's Bitcoin address. |
| `PUT` | `/me/links` | Update profile links. |
| `PUT` | `/me/subscriptions/:id` | Subscribe to a category or user. |
| `DELETE` | `/me/subscriptions/:id` | Unsubscribe from a category or user. |

## Inbox

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/inbox` | List inbox notifications. |
| `GET` | `/inbox/count` | Return the unread inbox count. |
| `DELETE` | `/inbox/:id` | Delete or clear an inbox notification. |

## Miscellaneous

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/leaderboard` | Return leaderboard entries. |
| `GET` | `/retrieve?url=:url` | Retrieve metadata for a submitted URL. |

The reference JavaScript API implementation is
[`upvotocracy-api`](https://github.com/profullstack/upvotocracy-api).
