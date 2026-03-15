import Link from "next/link";

type ProjectCardProps = {
  title: string;
  description: string;
};

export default function ProjectCard({ title, description }: ProjectCardProps) {

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/projects/${slug}`}>
      <div className="bg-gray-800 text-white rounded-lg p-5 shadow hover:bg-gray-700 transition cursor-pointer">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>
    </Link>
  );
}