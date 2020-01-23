@include('../header/header')

<body>
    <div class="wrapper">
        <!-- Sidebar -->
        @include('../sidemenu/SideMenu')
    <div id="content" class="page">
        @include('../HeaderBar/HeaderBar')
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                @yield('content')
            </div>
        </nav>
    </div>
    <!-- start footer Area -->
    <!-- End footer Area -->
</body>
@include('../footer/footer')
</html>

