import { trpc } from "../../utils/trpc";

export const GithubProfile: React.FC<{ userName: string }> = ({ userName }) => {
  // fully type-safe query interface based on trcp router definition
  // check network tab to observe that both useQuery() definitions get batched in a single request
  const { data, isLoading } = trpc.useQuery(["github.profile", userName]);

  if (isLoading)
    return <div className="flex items-center justify-center text-green-500">Loading profile..</div>;

  return (
    <div className="flex gap-2 items-center">
      <img className="h-12 w-12 rounded-full object-cover" src={data.avatar_url} />
      <div className="flex flex-col">
        <a
          className="text-sm text-violet-500 underline decoration-dotted underline-offset-2 cursor-pointer"
          href={data.html_url}
          target="_blank"
          rel="noreferrer"
        >
          {data.login}
        </a>
        <div className="flex gap-2">
          <span className="text-sm text-gray-600">{data.followers} followers</span>
          <span className="text-sm text-gray-600">{data.following} following</span>
          <span className="text-sm text-gray-600">{data.public_repos} 📦</span>
        </div>
      </div>
    </div>
  );
};
