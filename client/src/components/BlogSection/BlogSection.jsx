import classes from "./BlogSection.module.css"

function BlogSection() {
    return (
        <>
            <div className={classes.blog_container}>
                <h3 className={classes.blog_section_title}> Check out our latest Blogs! </h3>
                <div className={classes.blog_main}>
                    <div classes={classes.blog_single_content}>
                        <div className={classes.blog_thumbnail_image}>
                        </div>
                        <div className={classes.blog_thumbnail_content}>
                            <h3 className={classes.blog_thumbnail_content_heading}></h3>
                            <p className={classes.blog_thumnail_content_abstract}></p>
                        </div>
                    </div>
                    <div classname = {classes.blog_content_author_info}>
                        <img src="" alt="" className = {classes.blog_content_author_avatar}/>
                        <div className={classes.blog_content_author_info_text}>
                            <h5 className={classes.blog_content_author_name}></h5>
                            <p className={classes.blog_content_author_abstract}></p>
                        </div>
                    </div>
                </div>
        </div>
        </>
    );

};

export default BlogSection;