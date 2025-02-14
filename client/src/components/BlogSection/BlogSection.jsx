import classes from "./BlogSection.module.css"

function BlogSection(){
    return (
    <>
        <div className={classes.blog_container}>
            <h3 className={classes.blog_section_title}> Check out our latest Blogs! </h3>
            <div className= {classes.blog_main}>
                

            </div>
        </div>
    </>
    );
    
};

export default BlogSection;