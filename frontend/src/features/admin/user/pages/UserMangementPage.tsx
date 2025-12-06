import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Table from '@/components/data-table/Table';
import PageHeader from '@/components/molecules/PageHeader';
import type { UserResponse, UserRow } from '@/types/admin/user';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import userColumns from '../components/columns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminUserService from '@/services/admin/userManagement.service';

export default function UserManagementPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserResponse, Error>({
    queryKey: ['admin-users', pageIndex, pageSize, search, status],
    queryFn: () => AdminUserService.getUsers(pageIndex + 1, pageSize, search, status),
    placeholderData: prev => prev,
  });

  const toggleStatusMutation = useMutation<void, Error, string>({
    mutationFn: id => AdminUserService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setModalOpen(false);
    },
  });

  const openStatusModal = (user: UserRow) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openView = (id: string) => {
    console.log('open User view,', id);
  };

  return (
    <div className="bg-baground py-6 px-0 xl:p-6">
      <PageHeader title="User Management" description="Manage your platform users" />
      <div className="bg-card border rounded-xl p-6 pb-0 mt-12">
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => {
                setPageIndex(0);
                setSearch(e.target.value);
              }}
              leftIcon={<Search />}
            />
          </div>
          <div className="sm:col-span-5">
            <Select
              value={status}
              onChange={v => {
                setPageIndex(0);
                setStatus(v);
              }}
              leftIcon={<Filter />}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Blocked', value: 'blocked' },
              ]}
            />
          </div>
        </div>
      </div>
      <Table
        columns={userColumns(openStatusModal, openView)}
        data={data?.users ?? []}
        total={data?.total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
        manual={{
          serverSidePagination: true,
        }}
        isLoading={isLoading}
        onPageChange={p => setPageIndex(p)}
        onPageSizeChange={s => {
          setPageSize(s);
          setPageIndex(0);
        }}
      />

      {/* <StatusChangeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        loading={toggleStatusMutation.isPending}
        name={selectedUser?.name}
        fromStatus={selectedUser?.isBlocked ? 'Blocked' : 'Active'}
        toStatus={selectedUser?.isBlocked ? 'Active' : 'Blocked'}
        onConfirm={() => {
          if (!selectedUser) {
            return;
          }
          toggleStatusMutation.mutate(selectedUser._id);
        }}
      /> */}
    </div>
  );
}

///////////////////////////

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import AdminUserService from "@/services/admin/userManagement.service";
// import { userColumns } from "../columns";

// import type { BackendUserResponse, UserRow } from "@/types/admin/user";

// import DataTable from "@/components/data-table/DataTable";
// import StatusChangeModal from "@/components/molecules/StatusChangeModal";

// import Select from "@/components/atoms/Select";
// import Input from "@/components/atoms/Input";
// import { Search, Filter } from "lucide-react";
// import PageHeader from "@/components/molecules/PageHeader";

// export default function UserManagementPage() {
//   const [pageIndex, setPageIndex] = useState(0);
//   const [pageSize, setPageSize] = useState(5);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");
//   const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const queryClient = useQueryClient();

//   // ✅ Correct React Query v5 syntax
//   const { data, isLoading } = useQuery<BackendUserResponse, Error>({
//     queryKey: ["admin-users", pageIndex, pageSize, search, status],
//     queryFn: () =>
//       AdminUserService.getUsers(
//         pageIndex + 1,
//         pageSize,
//         search,
//         status
//       ),
//     placeholderData: (prev) => prev,
//   });

//   // Mutation (v5 uses isPending instead of isLoading)
//   const toggleStatusMutation = useMutation<void, Error, string>({
//     mutationFn: (id) => AdminUserService.toggleStatus(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-users"] });
//       setModalOpen(false);
//     },
//   });

//   const openStatusModal = (user: UserRow) => {
//     setSelectedUser(user);
//     setModalOpen(true);
//   };

//   const openView = (id: string) => {
//     console.log("Open user view:", id);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Filters */}
//       <div className="bg-card border rounded-xl p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Input
//             placeholder="Search by name/email..."
//             value={search}
//             onChange={(e) => {
//               setPageIndex(0);
//               setSearch(e.target.value);
//             }}
//             leftIcon={<Search />}
//           />

//           <Select
//             value={status}
//             onChange={(v) => {
//               setPageIndex(0);
//               setStatus(v);
//             }}
//             leftIcon={<Filter />}
//             options={[
//               { label: "All Status", value: "all" },
//               { label: "Active", value: "active" },
//               { label: "Blocked", value: "blocked" },
//             ]}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <DataTable
//         columns={userColumns(openStatusModal, openView)}
//         data={data?.users ?? []}
//         pageIndex={pageIndex}
//         pageSize={pageSize}
//         pageCount={Math.ceil((data?.total ?? 0) / pageSize) || 1}
//         manual={{
//           serverSidePagination: true,
//         }}
//         isLoading={isLoading}
//         onPageChange={(p) => setPageIndex(p)}
//         onPageSizeChange={(s) => {
//           setPageSize(s);
//           setPageIndex(0);
//         }}
//       />

//       {/* Status Modal */}
//       <StatusChangeModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         loading={toggleStatusMutation.isPending}
//         name={selectedUser?.name}
//         fromStatus={selectedUser?.isBlocked ? "Blocked" : "Active"}
//         toStatus={selectedUser?.isBlocked ? "Active" : "Blocked"}
//         onConfirm={() => {
//           if (!selectedUser) return;
//           toggleStatusMutation.mutate(selectedUser._id);
//         }}
//       />
//     </div>
//   );
// }
