import { useState, useEffect } from "react";
import axios from "axios";
import {
    Trash,
    Paintbrush,
    MoreHorizontal,
    BookOpen,
    Calendar, 
    Search,
    Filter,
    Loader2,
    Clock,
    GraduationCap,
    DollarSign,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "../../../components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from  "../../../components/ui/select";
import { Link, Outlet } from "react-router-dom";
import CourseDetailsDialog from "./CourseDetailsDialog";

interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    requirements: string;
    location: string;
    benefits?: string;
    status: string;
    course_type: string;
    education_level: string;
    companies_id?: string;
    created_at?: string;
    updated_at?: string;
    price?: string;
    instructor?: string;
}

export default function CoursesTable() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");

    // State for course details dialog
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/courses")
            .then((response) => {
                let coursesData: Course[] = [];

                if (Array.isArray(response.data)) {
                    coursesData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    coursesData = response.data.data;
                } else if (response.data.courses && Array.isArray(response.data.courses)) {
                    coursesData = response.data.courses;
                } else {
                    console.error('Unexpected API response format:', response.data);
                }

                setCourses(coursesData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status: string) => {
        if (!status) return "bg-purple-100 text-purple-800"; // Default fallback color
        switch (status.toLowerCase()) {
            case "ativo":
                return "bg-green-100 text-green-800";
            case "inativo":
                return "bg-red-100 text-red-800";
            case "em breve":
                return "bg-yellow-100 text-yellow-800";
            case "esgotado":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-purple-100 text-purple-800";
        }
    };
    

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    // Action handlers
    const handleEdit = (id: number) => {
        console.log("Edit course", id);
        // Implement edit logic
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
    
        try {
            await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Error deleting. Please try again.");
        }
    };

    const handleViewDetails = async (id: number) => {
        setDetailsDialogOpen(true);
        setLoadingDetails(true);
        setDetailsError(null);

        try {
            const endpoint = `http://127.0.0.1:8000/api/courses/${id}`;
            console.log(`Fetching course: ${endpoint}`);

            const response = await axios.get(endpoint);

            if (response.data && response.data.data) {
                setSelectedCourse(response.data.data);
            } else {
                const courseFromList = courses.find(course => course.id === id);
                if (courseFromList) {
                    setSelectedCourse(courseFromList);
                } else {
                    setDetailsError("API response doesn't contain expected data.");
                    console.error("Unexpected response:", response.data);
                }
            }
        } catch (error: any) {
            console.error("Error fetching course details:", error);

            if (error.response) {
                if (error.response.status === 404) {
                    setDetailsError(`Course not found. ID ${id} may not exist in the database.`);
                } else {
                    setDetailsError(`Server error: ${error.response.status} - ${error.response.statusText}`);
                }
            } else if (error.request) {
                setDetailsError("Could not connect to server. Please check if the backend is running.");
            } else {
                setDetailsError(`Error setting up request: ${error.message}`);
            }
        } finally {
            setLoadingDetails(false);
        }
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || course.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesType = filterType === "all" || course.course_type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesStatus && matchesType;
    });

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">Courses Management</CardTitle>
                        <CardDescription>
                            Manage all courses available on the platform.
                        </CardDescription>
                    </div>
                    <Link to="/dashboard/createcourse">
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            Add New Course
                        </Button>
                    </Link>
                    <Outlet />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="ativo">Active</SelectItem>
                                    <SelectItem value="inativo">Inactive</SelectItem>
                                    <SelectItem value="em breve">Coming Soon</SelectItem>
                                    <SelectItem value="esgotado">Sold Out</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterType}
                                onValueChange={setFilterType}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="presencial">In-person</SelectItem>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="hibrido">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading courses...</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead className="w-[250px]">Course</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="font-medium">{course.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{course.title}</p>
                                                        <p className="text-sm text-gray-500">{truncateText(course.description, 50)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={getStatusColor(course.status)}>
                                                        {course.status}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span>{course.duration || "Not specified"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                                        <span>{course.course_type || "Not specified"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4 text-amber-600" />
                                                        <span>{course.education_level || "Not specified"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-green-600" />
                                                        <span>{course.price || "Free"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span>{formatDate(course.created_at)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleViewDetails(course.id)}>
                                                                <Clock className="mr-2 h-4 w-4 text-purple-600" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEdit(course.id)}>
                                                                <Paintbrush className="mr-2 h-4 w-4 text-blue-600" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(course.id)}>
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-24 text-center">
                                                No courses found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-500">
                            Showing {filteredCourses.length} of {courses.length} courses
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="bg-purple-50">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog for course details 
            <CourseDetailsDialog
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
                selectedCourse={selectedCourse}
                loadingDetails={loadingDetails}
                detailsError={detailsError}
                handleEdit={handleEdit}
            />
            */}
        </div>
    );
}