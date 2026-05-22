import { auth } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  RiAdminLine,
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiMailLine,
  RiSearch2Line,
  RiShieldUserLine,
  RiUser3Line,
  RiUserStarLine,
} from "react-icons/ri";
import ImpersonateButton from "@/app/Components/ImpersonateButton";

const getRoleStyles = (role) => {
  switch (role) {
    case "admin":
      return {
        wrapper: "border-rose-100 bg-rose-50 text-rose-700 ring-rose-100",
        icon: RiShieldUserLine,
      };

    case "host":
      return {
        wrapper:
          "border-indigo-100 bg-indigo-50 text-indigo-700 ring-indigo-100",
        icon: RiUserStarLine,
      };

    default:
      return {
        wrapper: "border-stone-200 bg-stone-100 text-stone-700 ring-stone-200",
        icon: RiUser3Line,
      };
  }
};

const AdminPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/my-profile");
  }

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        user: ["list"],
      },
    },
  });

  if (!hasAccess?.success) {
    redirect("/");
  }

  const userList = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  const users = userList?.users || [];

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%),linear-gradient(to_bottom,#fafafa,#ffffff)]">
      {/* HERO */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-white/80 backdrop-blur-sm">
        <div
          aria-hidden
          className="absolute -top-20 right-0 size-72 rounded-full bg-indigo-200/30 blur-3xl"
        />

        <div className="container relative mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
                <RiAdminLine className="size-3.5" />
                Admin dashboard
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
                Manage Users
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">
                View and manage all registered users on the platform.
              </p>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-white px-6 py-5 shadow-sm">
              <p className="text-3xl font-bold text-indigo-700">
                {users.length}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-stone-500">
                Total users
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-8">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-stone-200/80 bg-white/90 p-4 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <RiSearch2Line className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search functionality later..."
              disabled
              className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pl-12 pr-4 text-sm text-stone-400 outline-none"
            />
          </div>

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <RiArrowLeftLine className="size-4" />
            Back to home
          </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white/90 shadow-sm ring-1 ring-stone-900/5 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-stone-200 bg-stone-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {users.map((user) => {
                  const roleStyle = getRoleStyles(user.role);
                  const RoleIcon = roleStyle.icon;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-indigo-50/30"
                    >
                      {/* USER */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative size-14 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                fill
                                unoptimized
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-lg font-bold text-indigo-700">
                                {user.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-stone-900">
                              {user.name || "Unnamed User"}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                              <RiMailLine className="size-4 shrink-0 text-indigo-500" />

                              <span className="truncate">{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ring-1 ${roleStyle.wrapper}`}
                        >
                          <RoleIcon className="size-3.5" />
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-stone-700">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          {/* VIEW / IMPERSONATE */}
                          <ImpersonateButton userId={user.id} userName={user.name} />

                          {/* EDIT */}
                          <button className="flex size-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700">
                            <RiEdit2Line className="size-4" />
                          </button>

                          {/* DELETE */}
                          <button className="flex size-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                            <RiDeleteBinLine className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* EMPTY */}
          {users.length === 0 && (
            <div className="grid place-items-center px-6 py-20 text-center">
              <div>
                <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-stone-100 text-stone-400">
                  <RiUser3Line className="size-8" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-stone-900">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-stone-500">
                  There are currently no registered users.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
